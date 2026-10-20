import { Icon } from "@/components/ui/Icon";
import { GalleryArt } from "@/components/ui/Placeholders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { gallery } from "@/data/gallery";

export function WorkGallery() {
  return (
    <section aria-labelledby="gallery-title" className="section-y border-t border-line bg-charcoal">
      <div className="container-site">
        <SectionHeading
          id="gallery-title"
          eyebrow={siteConfig.social.instagramHandle}
          title="Made with Forge"
          description="Fresh work from artists running our needles. Tag us to be featured."
          action={{ href: siteConfig.social.instagram, label: "Follow on Instagram" }}
        />
        <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {gallery.map((item, i) => (
            <li key={i} className={i === 0 ? "col-span-2 row-span-2" : ""}>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-card"
              >
                <GalleryArt
                  item={item}
                  className="aspect-square w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
                <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="flex items-center gap-2 text-sm font-medium text-bone">
                    <Icon name="instagram" size={16} /> {item.handle}
                  </span>
                  <span className="eyebrow mt-1 text-[10px] text-acid">Needle: {item.needle}</span>
                  <span className="sr-only">, opens Instagram in a new tab</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
