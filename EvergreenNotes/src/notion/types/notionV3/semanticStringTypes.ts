import * as base from 'aNotion/types/notionV3/notionBaseTypes';

//export type SemanticString = BasicString;
// | InlineMentionUser
// | InlineMentionPage
// | InlineMentionDate;

export enum SemanticFormatEnum {
   Bold = 'b',
   Italic = 'i',
   Strike = 's',
   Link = 'a',
   InlineCode = 'c',
   Colored = 'h',
   Commented = 'm',
   User = 'u',
   Page = 'p',
   DateTime = 'd',
}
export type SemanticFormatValue = string | undefined;
export type SemanticStringValue = string;

export type SemanticFormat = [SemanticFormatEnum, SemanticFormatValue];
export type SemanticString = [SemanticStringValue, SemanticFormat[]?];

// export type InlineMentionUser = ['‣', SemanticFormat[]];
// export type InlineMentionPage = ['‣', SemanticFormat[]];
// export type InlineMentionDate = ['‣', SemanticFormat[]];

/**
 * A structure to represent a reminder alarm before the start of
 * {@link DateTime}.
 *
 * e.g. `value` is `30`, `unit` is `minute`
 * -> 30 minutes before.
 *
 * e.g. `value` is `1`, `unit` is `day`, `time` is `09:00`
 * -> 1 day before at 9 a.m.
 */
export type Reminder = {
   value: number;
   unit: 'minute' | 'hour' | 'day' | 'week';
   /** e.g. "09:00" */
   time?: string;
};

export type RelativeDateTime = {
   type: 'date' | 'daterange' | 'datetime' | 'datetimerange';
   /** e.g. "2019-05-27" */
   start_date: string;
   /** e.g. "2019-05-27" */
   end_date?: string;
   /** e.g. "15:00" */
   start_time?: string;
   /** e.g. "15:00" */
   end_time?: string;
   reminder?: Reminder;
   date_format: 'relative';
};

export type AbsoluteDateTime = {
   isAbsolute: true;
   date_format: 'MM/DD/YYYY' | 'MMM DD, YYYY' | 'DD/MM/YYYY' | 'YYYY/MM/DD';
   /** 12h ("h:mm A") or 24h ("H:mm") */
   time_format?: 'h:mm A' | 'H:mm';
   time_zone?: base.TimeZone;
} & RelativeDateTime;
