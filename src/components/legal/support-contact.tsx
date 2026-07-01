import { LEGAL } from "@/lib/legal/site";

export function SupportContact({
  email = LEGAL.supportEmail,
  showPhone = true,
}: {
  email?: string;
  showPhone?: boolean;
}) {
  return (
    <>
      <a href={`mailto:${email}`}>{email}</a>
      {showPhone ? (
        <>
          {" "}
          or{" "}
          <a href={`tel:${LEGAL.supportPhoneTel}`}>{LEGAL.supportPhoneDisplay}</a>
        </>
      ) : null}
    </>
  );
}
