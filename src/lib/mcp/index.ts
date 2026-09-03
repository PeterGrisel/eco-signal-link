import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listBlogPosts from "./tools/list-blog-posts";
import getBlogPost from "./tools/get-blog-post";
import createBlogPost from "./tools/create-blog-post";
import listClients from "./tools/list-clients";
import listContactSubmissions from "./tools/list-contact-submissions";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "b2b-signal-based-system",
  title: "b2b signal based system",
  version: "0.1.0",
  instructions:
    "Tools voor B2BGroeiMachine: blogposts lezen en aanmaken, klanten opvragen en contactaanvragen bekijken. Alle acties draaien als de ingelogde gebruiker.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listBlogPosts, getBlogPost, createBlogPost, listClients, listContactSubmissions],
});
