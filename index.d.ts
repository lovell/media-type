/*!
  Copyright 2013 Lovell Fuller and others.
  SPDX-License-Identifier: Apache-2.0
*/

export class MediaType {
  static parse(mediaType: string): MediaType | null;

  constructor(mediaType?: string);

  essence: string;
  type: string;
  subtype: string;
  subtypeFacets: string[];
  suffix: string | null;
  parameters: Map<string, string>;

  hasSuffix(): boolean;
  isHTML(): boolean;
  isJavaScript(): boolean;
  isXML(): boolean;
  isPersonal(): boolean;
  isExperimental(): boolean;
  isVendor(): boolean;
  toString(): string;
}
