/*!
  Copyright 2013 Lovell Fuller and others.
  SPDX-License-Identifier: Apache-2.0
*/

// biome-ignore-all lint/correctness/noUnusedVariables: types only test file

import { MediaType } from "..";

const input: string = "a/b+c";

const mediaTypeConstructed: MediaType = new MediaType(input);

mediaTypeConstructed.essence;
mediaTypeConstructed.type;
mediaTypeConstructed.subtype;
mediaTypeConstructed.subtypeFacets;
mediaTypeConstructed.suffix;
mediaTypeConstructed.parameters;

mediaTypeConstructed.hasSuffix();
mediaTypeConstructed.isHTML();
mediaTypeConstructed.isJavaScript();
mediaTypeConstructed.isXML();
mediaTypeConstructed.isPersonal();
mediaTypeConstructed.isExperimental();
mediaTypeConstructed.isVendor();
mediaTypeConstructed.toString();

const mediaTypeParsed: MediaType | null = MediaType.parse(input);
if (mediaTypeParsed) {
  mediaTypeParsed.essence;
  mediaTypeParsed.type;
  mediaTypeParsed.subtype;
  mediaTypeParsed.subtypeFacets;
  mediaTypeParsed.suffix;
  mediaTypeParsed.parameters;

  mediaTypeParsed.hasSuffix();
  mediaTypeParsed.isHTML();
  mediaTypeParsed.isJavaScript();
  mediaTypeParsed.isXML();
  mediaTypeParsed.isPersonal();
  mediaTypeParsed.isExperimental();
  mediaTypeParsed.isVendor();
  mediaTypeParsed.toString();
}

const mediaTypeEmpty = new MediaType();

mediaTypeEmpty.essence;
mediaTypeEmpty.type;
mediaTypeEmpty.subtype;
mediaTypeEmpty.subtypeFacets;
mediaTypeEmpty.suffix;
mediaTypeEmpty.parameters;

mediaTypeEmpty.hasSuffix();
mediaTypeEmpty.isHTML();
mediaTypeEmpty.isJavaScript();
mediaTypeEmpty.isXML();
mediaTypeEmpty.isPersonal();
mediaTypeEmpty.isExperimental();
mediaTypeEmpty.isVendor();
mediaTypeEmpty.toString();

// @ts-expect-error
new MediaType(123);

// @ts-expect-error
new MediaType(true);
