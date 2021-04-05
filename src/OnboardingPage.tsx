import { useMemo } from 'preact/hooks'
import { SelectLanguage, SelectMinecraftPath, SelectVersion } from './configComponents'
import { useRequestMinecraftPath, useSupportedLanguages, useSupportedVersions } from './serverDataHooks'
import VerticalCarousel from './ui/VerticalCarousel'

export default function OnboardingPage() {
  const requestMinecraftPath = useRequestMinecraftPath()
  const { minecraftPath } = requestMinecraftPath
  const supportedVersions = useSupportedVersions(minecraftPath)
  const { selectedVersion } = supportedVersions
  const supportedLanguages = useSupportedLanguages(selectedVersion)
  const { selectedLanguage } = supportedLanguages
  return (
    <VerticalCarousel>
      <>
        <p>
          First, select the folder where your Minecraft installation is located. This app opens a file dialog in what is
          the default location for a Minecraft installation on your operating system, but if for whatever reason you
          have Minecraft installed in a different location, just navigate to there and select it. Be sure to select the
          .minecraft folder itself.
        </p>
        <SelectMinecraftPath {...requestMinecraftPath} />
      </>
      <>
        <p>
          Next, choose what version of Minecraft you'd like this app to assume. This affects things like what stats will
          have a friendly and readable label.
        </p>
        <SelectVersion {...supportedVersions} />
      </>
      <>
        <p>
          Finally, choose the language you'd like to see stats labelled in. The labels are pulled directly from your
          installation of Minecraft, so your options are limited to the available languages for the version you selected
          in the previous step.
        </p>
        <p>
          Please also note that beyond labels for stats, other words for this app will continue to be in English
          regardless of the language selection you make.
        </p>
        <SelectLanguage {...supportedLanguages} />
      </>
    </VerticalCarousel>
  )
}
