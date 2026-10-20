import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="eyebrow text-acid">Error 404</p>
      <h1 className="display mt-4 text-[clamp(4rem,14vw,10rem)] text-bone">Blown out.</h1>
      <p className="mt-4 max-w-md text-lg text-muted">This page doesn’t exist or has moved. Let’s get you back on the line.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" arrow>
          Back to home
        </ButtonLink>
        <ButtonLink href="/collections/all" variant="outline">
          Shop all
        </ButtonLink>
      </div>
    </div>
  );
}
