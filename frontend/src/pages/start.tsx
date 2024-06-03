import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import BottomPanel from "@/components/BottomPanel/BottomPanel";
import Head from "next/head";
import TopPanel from "@/components/TopPanel/TopPanel";
import { FloorSwitch } from "@/components/FloorSwitch/FloorSwitch";
import Sheet from "react-modal-sheet";
import { observer } from "mobx-react-lite";
import { uiStore } from "@/stores/ui";
import { Splash } from "@/components/Splash/Splash";
import { useEffect, useState } from "react";
import CommonInfo from "@/components/CommonInfo/CommonInfo";
import TreeMap from "@/map/TreeMap";

const Home = observer(function Home() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFading, setFading] = useState(false);

    useEffect(() => {
        if (!isLoaded) {
            const closeWithAnimation = async () => {
                setFading(true);
                await new Promise((r) => setTimeout(r, 400));
                setIsLoaded(true);
            };
            setTimeout(closeWithAnimation, 3000);
        }
    }, [isLoaded]);

    const Overlay = uiStore.overlay;

    return (
        <>
            {!isLoaded && <Splash isFading={isFading} />}
            <Head>
                <title>Vind</title>
                <meta name="description" content="Vind project" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <TreeMap/>
                {uiStore.showCommonInfo && <CommonInfo/>}
                {<Overlay.Component {...Overlay.props} />}
                <Sheet
                    isOpen={uiStore.openedSheet !== null}
                    onClose={uiStore.closeSheet}
                >
                    <Sheet.Container>
                        <Sheet.Header />
                        <Sheet.Content>
                            <Sheet.Scroller>
                                {uiStore.openedSheet && (
                                    <uiStore.openedSheet.Component
                                        {...uiStore.openedSheet.props}
                                    />
                                )}
                            </Sheet.Scroller>
                        </Sheet.Content>
                    </Sheet.Container>
                </Sheet>
            </main>
        </>
    );
});

export default Home;

export async function getStaticProps({ locale }: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common", "footer"])),
        },
    };
}
