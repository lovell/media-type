/*!
  Copyright 2013 Lovell Fuller and others.
  SPDX-License-Identifier: Apache-2.0
*/

import contentType from "content-type";
import { Bench, hrtimeNow } from "tinybench";
import WhatWGMIMEType from "whatwg-mimetype";

import { MediaType } from "../../dist/media-type.mjs";

const { MIMEType } = await import("node:util");

const input = [
  "application/json",
  "application/xml;charset=utf-8",
  "application/x-www-form-urlencoded;charset=windows-1252",
  "image/png",
  "image/svg+xml;charset=utf-8",
  "multipart/form-data; boundary=something",
  "text/html; charset=utf-8",
  "text/plain; charset=iso-8859-1; format=flowed",
];

const bench = new Bench({ now: hrtimeNow });

bench.add("whatwg-mimetype (new MIMEType)", () => {
  for (let i = 0; i < input.length; i++) {
    const output = new WhatWGMIMEType(input[i]);
    output.toString();
  }
});
MIMEType &&
  bench.add("node:util (new MIMEType)", () => {
    for (let i = 0; i < input.length; i++) {
      const output = new MIMEType(input[i]);
      output.toString();
    }
  });
bench.add("content-type (parse+format)", () => {
  for (let i = 0; i < input.length; i++) {
    const output = contentType.parse(input[i]);
    contentType.format(output);
  }
});
bench.add("media-type (MediaType.parse)", () => {
  for (let i = 0; i < input.length; i++) {
    const output = MediaType.parse(input[i]);
    output.toString();
  }
});
bench.add("media-type (new MediaType)", () => {
  for (let i = 0; i < input.length; i++) {
    const output = new MediaType(input[i]);
    output.toString();
  }
});

await bench.run();
console.table(bench.table());
