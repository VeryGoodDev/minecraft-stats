import Conf from 'conf'
import { configKeys } from '../util/common'

const preferences = new Conf({
  defaults: {
    [configKeys.MINECRAFT_PATH]: ``,
    [configKeys.MINECRAFT_VERSION]: ``,
    [configKeys.LANGUAGE_PREF]: `en_us`,
    [configKeys.CURRENT_LANGUAGE_STRINGS]: {},
  },
})
export function getConfigItem(key: string): string | Record<string, string> {
  return preferences.get(key)
}
export function updateConfigItem<T = unknown>(key: string, newValue: T): Promise<void> {
  if (!configHasKey(key)) {
    console.warn(`Attempting to update a non-existent config value of [${key}]`)
    return Promise.resolve()
  }
  return setConfigItem(key, newValue)
}
// FIXME: Unexpose after dev work is mostly done
export function setConfigItem<T>(key: string, newValue: T): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      preferences.set(key, newValue)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
// FIXME: Unexpose after dev work is mostly done
export function deleteConfigItem(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      preferences.delete(key)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
function configHasKey(key: string): boolean {
  return preferences.has(key)
}
