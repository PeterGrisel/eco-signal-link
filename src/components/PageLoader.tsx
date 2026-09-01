/**
 * Loader-animatie is verwijderd. Deze component rendert direct de content,
 * zodat bestaande <PageLoader> wrappers blijven werken zonder vertraging.
 */
const PageLoader = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export default PageLoader;
