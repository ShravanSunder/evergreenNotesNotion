//guid

export type UUID = string;
// An Unix timestamp number in milliseconds.
export type TimestampNumber = number;
// An Unix timestamp number in milliseconds.
export type TimestampString = string;
//  TZ database name in "*Area/Location*" format, e.g. "Asia/Taipei".
//  https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
export type TimeZone = string;
// A decimal between and including 0 and 1.
export type Proportion = number;
// * A publicly accessible URL.
export type PublicUrl = string;
// * A path relative to `www.notion.so`,
export type NotionRelativePath = string;
//* An URL starting with
// * `https://s3-us-west-2.amazonaws.com/secure.notion-static.com/`.
//* Must be authenticated before access.
export type NotionSecureUrl = string;
// A string containing exactly one emoji character.
export type Emoji = string;
//
export enum NotionColor {
   Grey = 'gray',
   Brown = 'brown',
   Orange = 'orange',
   Yellow = 'yellow',
   Teal = 'teal',
   Blue = 'blue',
   Purple = 'purple',
   Pink = 'pink',
   Red = 'red',
   GreyBg = 'gray_background',
   BrownBg = 'brown_background',
   OrangeBg = 'orange_background',
   YellowBg = 'yellow_background',
   TealBg = 'teal_background',
   BlueBg = 'blue_background',
   PurpleBg = 'purple_background',
   PinkBg = 'pink_background',
   RedBg = 'red_background',
}
// Record table names.
export type Table =
   | 'block'
   | 'collection'
   | 'collection_view'
   | 'notion_user'
   | 'user_root'
   | 'user_settings'
   | 'space'
   | 'space_view'
   | 'activity'
   | 'snapshot'
   | 'follow'
   | 'slack_integration'
   | 'comment'
   | 'discussion';
