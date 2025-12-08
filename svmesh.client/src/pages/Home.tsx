import susquehannaValley from "../assets/susquehanna-valley.jpg";
import meshtasticPowered from "../assets/meshtastic-powered.png";
import RecentUpdates from "../components/RecentUpdates";
import {
  HeroSection,
  PageSection,
  ContentGrid,
  StyledText,
  StyledLink,
} from "../components/ui";

export default function Home() {
  return (
    <>
      <HeroSection
        backgroundImage={susquehannaValley}
        title="We mesh well together."
        subtitle="We're a community group dedicated to connecting the Susquehanna Valley together using low-power, long-range radio devices."
        textAlign="left"
        rightImage={meshtasticPowered}
        rightImageAlt="Meshtastic Powered"
        attributionUrl="https://commons.wikimedia.org/wiki/File:Ridges_and_valleys_near_the_West_Branch_Susquehanna_River.jpg"
      />

      <PageSection>
        <ContentGrid
          mainContent={
            <>
              <StyledText type="heading" component="h2">
                What is a mesh?
              </StyledText>
              <StyledText type="body-large">
                A mesh is a decentralized network of devices that communicate
                with each other directly, rather than relying on a central hub
                or internet connection. This allows for greater resilience, as
                the network can adapt and reroute data even if some nodes go
                offline. We use low-power, long-range radio boards to create
                these connections, enabling devices to communicate over
                distances that traditional Wi-Fi or Bluetooth cannot cover. We
                currently utilize the Meshtastic open-source project to power
                our mesh network, which requires no amateur radio license.
              </StyledText>
              <StyledText type="heading" component="h2" marginTop={4}>
                How do I get started?
              </StyledText>
              <StyledText type="body-large">
                To get started, You will need a node. A node is a device that
                participates in the mesh network. These can be bought pre-built
                or built yourself using readily available boards. Once you have
                a node, you can follow our{" "}
                <StyledLink href="/getting-started">Getting Started</StyledLink>{" "}
                guide to set it up and join the mesh network.
              </StyledText>
            </>
          }
          sideContent={<RecentUpdates />}
        />
      </PageSection>
    </>
  );
}
