import { OSS_ORGS, type OssOrg } from "./portfolio-data";

// flat org row. name + what they work on. no pr counts no accordion

function OrgMark({ org }: { org: OssOrg }) {
  const isSvg = org.logo.endsWith(".svg");
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-portfolio-border bg-black">
      <img
        src={org.logo}
        alt=""
        aria-hidden
        className={isSvg ? "h-[55%] w-[55%] object-contain" : "h-full w-full object-cover"}
        style={org.invert ? { filter: "brightness(0) invert(1)" } : undefined}
      />
    </span>
  );
}

export function OssOrgList() {
  return (
    <ul className="flex flex-col">
      {OSS_ORGS.map((org) => (
        <li key={org.id} className="border-t border-portfolio-border/70 first:border-t-0">
          <a
            href={org.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 py-4 transition-colors hover:text-portfolio-text"
          >
            <OrgMark org={org} />
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-portfolio-text">{org.name}</h3>
              <p className="mt-0.5 text-[13px] text-portfolio-muted">{org.area}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
