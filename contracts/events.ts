/**
 * Contract source: https://git.io/JfefG
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */
import { ProvidersList, GetProviderRealUser } from '@ioc:Adonis/Addons/Auth'

declare module '@ioc:Adonis/Core/Event' {
  /*
  |--------------------------------------------------------------------------
  | Define typed events
  |--------------------------------------------------------------------------
  |
  | You can define types for events inside the following interface and
  | AdonisJS will make sure that all listeners and emit calls adheres
  | to the defined types.
  |
  | For example:
  |
  | interface EventsList {
  |   'new:user': UserModel
  | }
  |
  | Now calling `Event.emit('new:user')` will statically ensure that passed value is
  | an instance of the the UserModel only.
  |
  */
  interface EventsList {
    'auth:login': GetProviderRealUser<keyof ProvidersList>
    'auth:logout': GetProviderRealUser<keyof ProvidersList>
    'auth:register': GetProviderRealUser<keyof ProvidersList>
  }
}
