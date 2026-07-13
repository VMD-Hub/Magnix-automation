import Image from "next/image";
import { ProfileConnectPanel } from "@/components/personal-brand/vu-nguyen/profile-connect-panel";
import { ProfileSocialIcons } from "@/components/personal-brand/vu-nguyen/profile-social-icons";
import { SaveVcardButton } from "@/components/personal-brand/vu-nguyen/save-vcard-button";
import { RubySurfaceOrnament } from "@/components/brand/ruby-surface-ornament";
import {
  getVuNguyenPortraitSrc,
  getVuNguyenProfile,
  VU_NGUYEN_PORTRAIT_OBJECT_POSITION,
  VU_NGUYEN_PORTRAIT_SCALE,
  VU_NGUYEN_THANK_YOU,
} from "@/lib/personal-brand/vu-nguyen/profile-content";
import { cn } from "@/lib/ui/cn";

/** Digital name card — NFC, QR in thẻ, link chia sẻ. */
export function VuNguyenProfile() {
  const profile = getVuNguyenProfile();
  const portraitSrc = getVuNguyenPortraitSrc();

  return (
    <div className="proptech-catalog-page proptech-section-glow mx-auto flex min-h-dvh max-w-lg flex-col container-px py-4 sm:max-w-xl sm:py-5">
      <section className="proptech-ruby-holder relative z-10 flex flex-1 flex-col px-5 py-6 sm:px-7 sm:py-7">
        <RubySurfaceOrnament variant="holder" />
        <div className="proptech-ruby-holder__content flex flex-1 flex-col">
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                "relative h-28 w-28 shrink-0 overflow-hidden rounded-full",
                "border-[3px] border-gold-500/50 bg-brand-950 shadow-lg shadow-black/20",
              )}
            >
              {portraitSrc ? (
                <Image
                  src={portraitSrc}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  style={{
                    objectPosition: VU_NGUYEN_PORTRAIT_OBJECT_POSITION,
                    transform: `scale(${VU_NGUYEN_PORTRAIT_SCALE})`,
                    transformOrigin: VU_NGUYEN_PORTRAIT_OBJECT_POSITION,
                  }}
                  sizes="112px"
                  priority
                />
              ) : (
                <span className="text-3xl font-extrabold text-gold-400">
                  {profile.initials}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              {profile.name}
            </h1>
            <p className="proptech-kicker mt-1.5">{profile.organizationRole}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
              {profile.jobTitle}
            </p>
          </div>

          <ProfileSocialIcons className="mt-5" />

          <div className="mt-5 flex justify-center">
            <SaveVcardButton className="min-w-[12rem] px-8" />
          </div>

          <ProfileConnectPanel variant="on-dark" className="mt-6" />

          <footer className="mt-auto space-y-1 border-t border-white/15 pt-5 text-center">
            <p className="text-sm text-white/85">{VU_NGUYEN_THANK_YOU.vi}</p>
            <p className="text-sm text-white/65">{VU_NGUYEN_THANK_YOU.en}</p>
          </footer>
        </div>
      </section>
    </div>
  );
}
