import { useState, useEffect } from "react";
import { ThumbsUp, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const getSessionId = () => {
  let id = localStorage.getItem("cs_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("cs_session_id", id);
  }
  return id;
};

interface Props {
  slug: string;
}

const CheatsheetFeedback = ({ slug }: Props) => {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [totalHelpful, setTotalHelpful] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const sessionId = getSessionId();

  const applyAggregates = (data: any) => {
    if (!data) return;
    setTotalHelpful(data.totalHelpful ?? 0);
    setTotalRatings(data.totalRatings ?? 0);
    setAvgRating(data.avgRating ?? 0);
    if (data.mine) {
      setHelpful(data.mine.helpful ?? null);
      setRating(data.mine.rating ?? null);
      setSubmitted(true);
    }
  };

  const fetchAggregates = async () => {
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cheatsheet-feedback?slug=${encodeURIComponent(slug)}&session_id=${encodeURIComponent(sessionId)}`;
      const res = await fetch(url, {
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      applyAggregates(await res.json());
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchAggregates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, sessionId]);

  const upsert = async (h: boolean | null, r: number | null) => {
    const { error } = await supabase.functions.invoke("cheatsheet-feedback", {
      body: { slug, session_id: sessionId, helpful: h, rating: r },
    });
    if (error) {
      toast.error("Feedback opslaan mislukt");
      return;
    }
    setSubmitted(true);
    toast.success("Bedankt voor je feedback!");

    await fetchAggregates();
  };

  const handleHelpful = () => {
    const newVal = helpful ? null : true;
    setHelpful(newVal);
    upsert(newVal, rating);
  };

  const handleRate = (stars: number) => {
    setRating(stars);
    upsert(helpful, stars);
  };

  return (
    <div className="md:col-span-2 bg-[#181818] rounded-md p-4 md:p-5 border border-[#222]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Helpful */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleHelpful}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm font-semibold ${
              helpful
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                : "bg-[#141414] border-[#222] text-[#888] hover:border-[#444] hover:text-white"
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${helpful ? "fill-emerald-400" : ""}`} />
            Heeft geholpen
          </button>
          {totalHelpful > 0 && (
            <span className="text-[11px] text-[#666]">
              {totalHelpful}× nuttig
            </span>
          )}
        </div>

        {/* Star rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => handleRate(s)}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-5 h-5 transition-colors ${
                    s <= (hoverRating || rating || 0)
                      ? "text-amber-400 fill-amber-400"
                      : "text-[#333] hover:text-[#555]"
                  }`}
                />
              </button>
            ))}
          </div>
          {totalRatings > 0 && (
            <span className="text-[11px] text-[#666]">
              {avgRating.toFixed(1)} / 5 ({totalRatings})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheatsheetFeedback;
