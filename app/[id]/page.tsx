import { notFound, redirect } from "next/navigation";
import RedirectClient from "@/components/redirect-client";
import { getDeviceInfo } from "@/lib/device";
import { getLinkById } from "@/lib/links";

export const dynamic = "force-dynamic";

type Params = {
  id: string;
};

export default async function LinkRedirectPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const link = await getLinkById(id);

  if (!link) {
    notFound();
  }

  const device = await getDeviceInfo();

  console.log(
    `[${new Date().toISOString()}] ${id} (${link.type}) - ${device.isMobile ? "Mobile" : "Desktop"} - ${device.platform}`
  );

  if (!device.isMobile) {
    redirect(link.webUrl);
  }

  const store = device.isiOS ? link.appStore : link.playStore;

  return <RedirectClient appUrl={link.appUrl} store={store} linkName={link.name} />;
}
