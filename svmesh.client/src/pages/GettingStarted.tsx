import tBeam from "../assets/tbeam.jpg";
import { SimpleHero, PageSection, StyledText } from "../components/ui";

export default function GettingStarted() {
  return (
    <>
      <SimpleHero
        backgroundImage={tBeam}
        title="Getting Started"
        subtitle="Learn how to join the Susquehanna Valley mesh network"
        backgroundPosition="center 70%"
      />
      <PageSection>
        <StyledText type="heading" component="h2" sx={{ mb: 2 }}>
          Welcome to the mesh!
        </StyledText>
        <StyledText type="body-large" sx={{ mb: 3 }}>
          This guide is intended for first-time node buyers looking to get their
          first node, and first-time node owners looking to get their devices up
          and running on the mesh. This guide will walk you through the choices
          on the market for nodes, getting your node online, how to change your
          node's name, and where to find help if you run into any issues.
        </StyledText>

        <StyledText type="heading" component="h2" sx={{ mt: 4 }}>
          What You'll Need
        </StyledText>

        <StyledText type="body-large" sx={{ mb: 2 }}>
          To participate in our mesh network, you'll need a compatible device.
          Here are the most popular options:
        </StyledText>

        <StyledText type="subheading" component="h3">
          Recommended Devices
        </StyledText>

        <StyledText type="body" sx={{ mb: 3 }}>
          • **Heltec LoRa32 V3** - Great for beginners, built-in display and
          battery connector
          <br />
          • **LILYGO T-Beam** - Popular choice with GPS and excellent range
          <br />
          • **RAK WisBlock** - Modular system, great for custom builds
          <br />• **Heltec WiFi LoRa32** - Budget-friendly option with good
          performance
        </StyledText>

        <StyledText type="heading" component="h2" sx={{ mt: 4 }}>
          Setting Up Your Device
        </StyledText>

        <StyledText type="body-large">
          Once you have your hardware, follow these steps to get connected to
          our network. We'll provide detailed instructions for flashing
          firmware, configuring your device, and joining our community channels.
        </StyledText>
      </PageSection>
    </>
  );
}
