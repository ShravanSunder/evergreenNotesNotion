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
export type NotionColor =
   | 'gray'
   | 'brown'
   | 'orange'
   | 'yellow'
   | 'teal'
   | 'blue'
   | 'purple'
   | 'pink'
   | 'red'
   | 'gray_background'
   | 'brown_background'
   | 'orange_background'
   | 'yellow_background'
   | 'teal_background'
   | 'blue_background'
   | 'purple_background'
   | 'pink_background'
   | 'red_background';
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
