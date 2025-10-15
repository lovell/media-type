/*!
  Copyright 2013 Lovell Fuller and others.
  SPDX-License-Identifier: Apache-2.0
*/

import { deepEqual, ok, strictEqual, throws } from "node:assert";
import { test } from "node:test";
import { MediaType } from "../dist/media-type.mjs";

const validMediaTypes = [
  // Representative sample from http://www.iana.org/assignments/media-types/index.html
  "application/atom+xml",
  "application/cals-1840",
  "application/mac-binhex40",
  "application/mikey",
  "application/rpki-ghostbusters",
  "application/sparql-query",
  "application/sparql-results+xml",
  "application/vnd.3M.Post-it-Notes",
  "application/vnd.nintendo.snes.rom",
  "application/vnd.nokia.iSDS-radio-presets",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml",
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml;k2="v2a;v2b";k1=v1',
  "application/vnd.Quark.QuarkXPress",
  "application/vnd.software602.filler.form-xml-zip",
  "application/vnd.wrq-hp3000-labelled",
  "application/x-test",
  "application/yin+xml",
  "application/yang",
  "audio/amr-wb+",
  "audio/ip-mr_v2.5",
  "audio/mpeg",
  "audio/t140c",
  "audio/x-test",
  "font/ttf",
  "font/woff",
  "image/g3fax",
  "image/png",
  "image/svg+xml;charset=utf8",
  "image/t38",
  "image/x-test",
  "haptics/hjif",
  "haptics/hmpg",
  "message/delivery-status",
  "message/s-http",
  "message/x-test",
  "model/x-test",
  "model/x3d+xml",
  "multipart/form-data",
  "multipart/voice-message",
  "multipart/x-test",
  "text/html; charset=utf-8",
  "text/javascript",
  "text/prs.lines.tag",
  "text/RED",
  "text/vnd.DMClientScript; charset=iso-8859-1",
  "text/vnd.sun.j2me.app-descriptor",
  "text/x-test",
  "video/CelB",
  "video/H264",
  "video/vnd.CCTV",
  "video/vnd.iptvforum.2dparityfec-2005",
  "video/x-test",

  // http://cite.opengeospatial.org/te-nsg/wfs-1.1.0/WFS_1_1_0_NSG_profile.html
  "text/xml; subtype=gml/3.1.1",

  // https://twitter.com/fcw/status/398604109525184512
  "application/LD+JSON-SQL*CSV.1",

  // wildcards from http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.1
  "*/*",
  "audio/*",
];

const invalidMediaTypes = [
  "",
  " ",
  null,
  "null",
  "/",
  "text/;plain",
  'text/"plain"',
  "text/p£ain",
  "text/(plain)",
  "text/@plain",
  "text/plain,wrong",
  "*",
  "*/plain",

  // https://bugs.launchpad.net/kde-baseapps/+bug/570832
  "fonts/package",

  // http://en.wikipedia.org/wiki/Chemical_file_format#The_Chemical_MIME_Project
  "chemical/x-cif",

  // https://bugs.mageia.org/show_bug.cgi?id=343
  "virtual/bluedevil-audio",

  // Example media types from http://tools.ietf.org/html/rfc4735
  "example/test",
  "application/example",
  "audio/example",
  "font/example",
  "image/example",
  "message/example",
  "model/example",
  "multipart/example",
  "text/example",
  "video/example",
];

test("Valid media types via constructor", () => {
  validMediaTypes.forEach(function (value) {
    const type = new MediaType(value);
    ok(type, `Valid media type ${value} was invalid`);
  });
});

test("Invalid media types via constructor", () => {
  invalidMediaTypes.forEach((value) => {
    throws(
      () => new MediaType(value),
      /Invalid MediaType/,
      `Invalid media type ${value} did not throw`,
    );
  });
});

test("Valid media types via parse", () => {
  validMediaTypes.forEach(function (value) {
    const type = MediaType.parse(value);
    ok(type, `Valid media type ${value} was invalid`);
  });
});

test("Invalid media types via parse", () => {
  invalidMediaTypes.forEach((value) => {
    const type = MediaType.parse(value);
    strictEqual(type, null, `Invalid media type ${value} was valid`);
  });
});

test("Detailed media type properties", () => {
  var type = MediaType.parse(
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml;k2="v2a;v2b"; k1=v1',
  );
  strictEqual(type.type, "application");
  strictEqual(
    type.subtype,
    "vnd.openxmlformats-officedocument.wordprocessingml.document.glossary",
  );
  ok(type.hasSuffix());
  strictEqual(type.suffix, "xml");
  deepEqual(type.subtypeFacets, [
    "vnd",
    "openxmlformats-officedocument",
    "wordprocessingml",
    "document",
    "glossary",
  ]);
  deepEqual(
    type.parameters,
    new Map([
      ["k1", "v1"],
      ["k2", "v2a;v2b"],
    ]),
  );
  ok(type.isVendor());
  ok(!type.isPersonal());
  ok(!type.isExperimental());
  ok(!type.isHTML());
  ok(type.isXML());
  ok(!type.isJavaScript());
  strictEqual(
    type.toString(),
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml;k2="v2a;v2b";k1=v1',
  );

  type = MediaType.parse("application/sparql-results+xml");
  strictEqual(type.type, "application");
  strictEqual(type.subtype, "sparql-results");
  ok(type.hasSuffix());
  strictEqual(type.suffix, "xml");
  deepEqual(type.subtypeFacets, ["sparql-results"]);
  deepEqual(type.parameters.size, 0);
  ok(!type.isVendor());
  ok(!type.isPersonal());
  ok(!type.isExperimental());
  strictEqual(type.toString(), "application/sparql-results+xml");

  type = MediaType.parse("image/svg+xml; CHARSET = utf8");
  strictEqual(type.type, "image");
  strictEqual(type.subtype, "svg");
  ok(type.hasSuffix());
  strictEqual(type.suffix, "xml");
  deepEqual(type.subtypeFacets, ["svg"]);
  deepEqual(type.parameters, new Map([["charset", "utf8"]]));
  ok(!type.isVendor());
  ok(!type.isPersonal());
  ok(!type.isExperimental());
  strictEqual(type.toString(), "image/svg+xml;charset=utf8");

  type = MediaType.parse("audio/amr-wb+");
  strictEqual(type.type, "audio");
  strictEqual(type.subtype, "amr-wb+");
  ok(!type.hasSuffix());
  deepEqual(type.subtypeFacets, ["amr-wb+"]);
  deepEqual(type.parameters, new Map());
  ok(!type.isVendor());
  ok(!type.isPersonal());
  ok(!type.isExperimental());
  strictEqual(type.toString(), "audio/amr-wb+");

  type = MediaType.parse("text/vnd.DMClientScript;charset=iso-8859-1");
  strictEqual(type.type, "text");
  strictEqual(type.subtype, "vnd.dmclientscript");
  ok(!type.hasSuffix());
  deepEqual(type.subtypeFacets, ["vnd", "dmclientscript"]);
  deepEqual(type.parameters, new Map([["charset", "iso-8859-1"]]));
  ok(type.isVendor());
  ok(!type.isPersonal());
  ok(!type.isExperimental());
  strictEqual(type.toString(), "text/vnd.dmclientscript;charset=iso-8859-1");

  type = MediaType.parse("text/prs.lines.tag");
  strictEqual(type.type, "text");
  strictEqual(type.subtype, "prs.lines.tag");
  ok(!type.hasSuffix());
  deepEqual(type.subtypeFacets, ["prs", "lines", "tag"]);
  deepEqual(type.parameters, new Map());
  ok(!type.isVendor());
  ok(type.isPersonal());
  ok(!type.isExperimental());
  strictEqual(type.toString(), "text/prs.lines.tag");

  type = MediaType.parse("text/x.test");
  strictEqual(type.type, "text");
  strictEqual(type.subtype, "x.test");
  ok(!type.hasSuffix());
  deepEqual(type.subtypeFacets, ["x", "test"]);
  deepEqual(type.parameters, new Map());
  ok(!type.isVendor());
  ok(!type.isPersonal());
  ok(type.isExperimental());
  strictEqual(type.toString(), "text/x.test");

  type = MediaType.parse("text/X-test");
  strictEqual(type.type, "text");
  strictEqual(type.subtype, "x-test");
  ok(!type.hasSuffix());
  deepEqual(type.subtypeFacets, ["x-test"]);
  deepEqual(type.parameters, new Map());
  ok(!type.isVendor());
  ok(!type.isPersonal());
  ok(type.isExperimental());
  strictEqual(type.toString(), "text/x-test");

  type = MediaType.parse("text/x-test");
  strictEqual(type.type, "text");
  strictEqual(type.subtype, "x-test");
  ok(!type.hasSuffix());
  deepEqual(type.subtypeFacets, ["x-test"]);
  deepEqual(type.parameters, new Map());
  ok(!type.isVendor());
  ok(!type.isPersonal());
  ok(type.isExperimental());
  strictEqual(type.toString(), "text/x-test");

  // https://x.com/fcw/status/398604109525184512
  type = MediaType.parse("application/LD+JSON-SQL*CSV.1");
  strictEqual(type.type, "application");
  strictEqual(type.subtype, "ld");
  ok(type.hasSuffix());
  strictEqual(type.suffix, "json-sql*csv.1");
  deepEqual(type.subtypeFacets, ["ld"]);
  deepEqual(type.parameters, new Map());
  ok(!type.isVendor());
  ok(!type.isPersonal());
  ok(!type.isExperimental());
  strictEqual(type.toString(), "application/ld+json-sql*csv.1");

  // https://github.com/lovell/media-type/issues/1
  type = MediaType.parse("image/svg+xml;charset=utf8;format=foo");
  strictEqual(type.type, "image");
  strictEqual(type.subtype, "svg");
  ok(type.hasSuffix());
  strictEqual(type.suffix, "xml");
  deepEqual(type.subtypeFacets, ["svg"]);
  deepEqual(
    type.parameters,
    new Map([
      ["charset", "utf8"],
      ["format", "foo"],
    ]),
  );
  ok(!type.isVendor());
  ok(!type.isPersonal());
  ok(!type.isExperimental());
  strictEqual(type.toString(), "image/svg+xml;charset=utf8;format=foo");
});
