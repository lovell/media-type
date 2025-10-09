/*!
  Copyright 2013 Lovell Fuller and others.
  SPDX-License-Identifier: Apache-2.0
*/

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

test("Valid media types via constructor", (t) => {
  t.plan(validMediaTypes.length);
  validMediaTypes.forEach(function (value) {
    const type = new MediaType(value);
    t.assert.ok(type, `Valid media type ${value} was invalid`);
  });
});

test("Invalid media types via constructor", (t) => {
  t.plan(invalidMediaTypes.length);
  invalidMediaTypes.forEach(function (value) {
    t.assert.throws(
      () => new MediaType(value),
      /Invalid MediaType/,
      `Invalid media type ${value} did not throw`,
    );
  });
});

test("Valid media types via parse", (t) => {
  t.plan(validMediaTypes.length);
  validMediaTypes.forEach(function (value) {
    const type = MediaType.parse(value);
    t.assert.ok(type, `Valid media type ${value} was invalid`);
  });
});

test("Invalid media types via parse", (t) => {
  t.plan(invalidMediaTypes.length);
  invalidMediaTypes.forEach((value) => {
    const type = MediaType.parse(value);
    t.assert.strictEqual(type, null, `Invalid media type ${value} was valid`);
  });
});

test("Detailed media type properties", (t) => {
  var type = MediaType.parse(
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml;k2="v2a;v2b"; k1=v1',
  );
  t.assert.strictEqual(type.type, "application");
  t.assert.strictEqual(
    type.subtype,
    "vnd.openxmlformats-officedocument.wordprocessingml.document.glossary",
  );
  t.assert.ok(type.hasSuffix());
  t.assert.strictEqual(type.suffix, "xml");
  t.assert.deepEqual(type.subtypeFacets, [
    "vnd",
    "openxmlformats-officedocument",
    "wordprocessingml",
    "document",
    "glossary",
  ]);
  t.assert.deepEqual(
    type.parameters,
    new Map([
      ["k1", "v1"],
      ["k2", "v2a;v2b"],
    ]),
  );
  t.assert.ok(type.isVendor());
  t.assert.ok(!type.isPersonal());
  t.assert.ok(!type.isExperimental());
  t.assert.ok(!type.isHTML());
  t.assert.ok(type.isXML());
  t.assert.ok(!type.isJavaScript());
  t.assert.strictEqual(
    type.toString(),
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml;k2="v2a;v2b";k1=v1',
  );

  type = MediaType.parse("application/sparql-results+xml");
  t.assert.strictEqual(type.type, "application");
  t.assert.strictEqual(type.subtype, "sparql-results");
  t.assert.ok(type.hasSuffix());
  t.assert.strictEqual(type.suffix, "xml");
  t.assert.deepEqual(type.subtypeFacets, ["sparql-results"]);
  t.assert.deepEqual(type.parameters.size, 0);
  t.assert.ok(!type.isVendor());
  t.assert.ok(!type.isPersonal());
  t.assert.ok(!type.isExperimental());
  t.assert.strictEqual(type.toString(), "application/sparql-results+xml");

  type = MediaType.parse("image/svg+xml; CHARSET = utf8");
  t.assert.strictEqual(type.type, "image");
  t.assert.strictEqual(type.subtype, "svg");
  t.assert.ok(type.hasSuffix());
  t.assert.strictEqual(type.suffix, "xml");
  t.assert.deepEqual(type.subtypeFacets, ["svg"]);
  t.assert.deepEqual(type.parameters, new Map([["charset", "utf8"]]));
  t.assert.ok(!type.isVendor());
  t.assert.ok(!type.isPersonal());
  t.assert.ok(!type.isExperimental());
  t.assert.strictEqual(type.toString(), "image/svg+xml;charset=utf8");

  type = MediaType.parse("audio/amr-wb+");
  t.assert.strictEqual(type.type, "audio");
  t.assert.strictEqual(type.subtype, "amr-wb+");
  t.assert.ok(!type.hasSuffix());
  t.assert.deepEqual(type.subtypeFacets, ["amr-wb+"]);
  t.assert.deepEqual(type.parameters, new Map());
  t.assert.ok(!type.isVendor());
  t.assert.ok(!type.isPersonal());
  t.assert.ok(!type.isExperimental());
  t.assert.strictEqual(type.toString(), "audio/amr-wb+");

  type = MediaType.parse("text/vnd.DMClientScript;charset=iso-8859-1");
  t.assert.strictEqual(type.type, "text");
  t.assert.strictEqual(type.subtype, "vnd.dmclientscript");
  t.assert.ok(!type.hasSuffix());
  t.assert.deepEqual(type.subtypeFacets, ["vnd", "dmclientscript"]);
  t.assert.deepEqual(type.parameters, new Map([["charset", "iso-8859-1"]]));
  t.assert.ok(type.isVendor());
  t.assert.ok(!type.isPersonal());
  t.assert.ok(!type.isExperimental());
  t.assert.strictEqual(
    type.toString(),
    "text/vnd.dmclientscript;charset=iso-8859-1",
  );

  type = MediaType.parse("text/prs.lines.tag");
  t.assert.strictEqual(type.type, "text");
  t.assert.strictEqual(type.subtype, "prs.lines.tag");
  t.assert.ok(!type.hasSuffix());
  t.assert.deepEqual(type.subtypeFacets, ["prs", "lines", "tag"]);
  t.assert.deepEqual(type.parameters, new Map());
  t.assert.ok(!type.isVendor());
  t.assert.ok(type.isPersonal());
  t.assert.ok(!type.isExperimental());
  t.assert.strictEqual(type.toString(), "text/prs.lines.tag");

  type = MediaType.parse("text/x.test");
  t.assert.strictEqual(type.type, "text");
  t.assert.strictEqual(type.subtype, "x.test");
  t.assert.ok(!type.hasSuffix());
  t.assert.deepEqual(type.subtypeFacets, ["x", "test"]);
  t.assert.deepEqual(type.parameters, new Map());
  t.assert.ok(!type.isVendor());
  t.assert.ok(!type.isPersonal());
  t.assert.ok(type.isExperimental());
  t.assert.strictEqual(type.toString(), "text/x.test");

  type = MediaType.parse("text/X-test");
  t.assert.strictEqual(type.type, "text");
  t.assert.strictEqual(type.subtype, "x-test");
  t.assert.ok(!type.hasSuffix());
  t.assert.deepEqual(type.subtypeFacets, ["x-test"]);
  t.assert.deepEqual(type.parameters, new Map());
  t.assert.ok(!type.isVendor());
  t.assert.ok(!type.isPersonal());
  t.assert.ok(type.isExperimental());
  t.assert.strictEqual(type.toString(), "text/x-test");

  type = MediaType.parse("text/x-test");
  t.assert.strictEqual(type.type, "text");
  t.assert.strictEqual(type.subtype, "x-test");
  t.assert.ok(!type.hasSuffix());
  t.assert.deepEqual(type.subtypeFacets, ["x-test"]);
  t.assert.deepEqual(type.parameters, new Map());
  t.assert.ok(!type.isVendor());
  t.assert.ok(!type.isPersonal());
  t.assert.ok(type.isExperimental());
  t.assert.strictEqual(type.toString(), "text/x-test");

  // https://x.com/fcw/status/398604109525184512
  type = MediaType.parse("application/LD+JSON-SQL*CSV.1");
  t.assert.strictEqual(type.type, "application");
  t.assert.strictEqual(type.subtype, "ld");
  t.assert.ok(type.hasSuffix());
  t.assert.strictEqual(type.suffix, "json-sql*csv.1");
  t.assert.deepEqual(type.subtypeFacets, ["ld"]);
  t.assert.deepEqual(type.parameters, new Map());
  t.assert.ok(!type.isVendor());
  t.assert.ok(!type.isPersonal());
  t.assert.ok(!type.isExperimental());
  t.assert.strictEqual(type.toString(), "application/ld+json-sql*csv.1");

  // https://github.com/lovell/media-type/issues/1
  type = MediaType.parse("image/svg+xml;charset=utf8;format=foo");
  t.assert.strictEqual(type.type, "image");
  t.assert.strictEqual(type.subtype, "svg");
  t.assert.ok(type.hasSuffix());
  t.assert.strictEqual(type.suffix, "xml");
  t.assert.deepEqual(type.subtypeFacets, ["svg"]);
  t.assert.deepEqual(
    type.parameters,
    new Map([
      ["charset", "utf8"],
      ["format", "foo"],
    ]),
  );
  t.assert.ok(!type.isVendor());
  t.assert.ok(!type.isPersonal());
  t.assert.ok(!type.isExperimental());
  t.assert.strictEqual(
    type.toString(),
    "image/svg+xml;charset=utf8;format=foo",
  );
});
