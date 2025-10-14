# media-type

JavaScript package to parse and validate
[RFC6838](https://datatracker.ietf.org/doc/html/rfc6838)
and
[RFC9694](https://datatracker.ietf.org/doc/html/rfc9694)
media types.

The typical use case is for handling `Content-Type` HTTP headers.

- High performance, benchmarked against alternative packages and runtime-provided utilities
- Includes TypeScript definitions
- Provides ESM and CommonJS exports
- Supports vendor subtype trees, +suffixes, wildcards and semicolon delimited parameters
- Extensive test cases

## Install

```sh
npm install media-type
```

## Usage examples

```javascript
import { MediaType } from "media-type"

try {
  const media = new MediaType("text/plain");

  console.log(media.type);           // "text"
  console.log(media.subtype);        // "plain"
  console.log(media.subtypeFacets);  // ["plain"]
  console.log(media.essence);        // "text/plain"
  console.log(media.hasSuffix());    // false
} catch (err) {
  // TypeError
}
```

```javascript
import { MediaType } from "media-type"

const media = MediaType.parse("application/vnd.Company.App.Entity-v2+xml; charset=utf-8; BOM=true");

if (media) {
  console.log(media.type);             // "application"
  console.log(media.subtype);          // "vnd.company.app.entity-v2"
  console.log(media.subtypeFacets);    // ["vnd", "company", "app", "entity-v2"]
  console.log(media.essence);          // "application/vnd.company.app.entity-v2+xml"
  console.log(media.suffix);           // "xml"
  console.log(media.parameters);       // Map({ charset: "utf-8", bom: "true" })
  console.log(media.hasSuffix());      // true
  console.log(media.isVendor());       // true
  console.log(media.isPersonal());     // false
  console.log(media.isExperimental()); // false
  console.log(media.isHTML());         // false
  console.log(media.isJavaScript());   // false
  console.log(media.isXML());          // true
  console.log(media.toString());       // "application/vnd.company.app.entity-v2+xml;charset=utf-8;bom=true;"
}
```

## Performance

Benchmark tests to measure latency (lower is better) and throughput (higher is better)
when parsing common `Content-Type` headers using this package and alternatives.

```
$ node -v
v24.10.0
┌──────────────────────────────────┬──────────────────┬───────────────────┬────────────────────────┬────────────────────────┬─────────┐
│ Task name                        │ Latency avg (ns) │ Latency med (ns)  │ Throughput avg (ops/s) │ Throughput med (ops/s) │ Samples │
├──────────────────────────────────┼──────────────────┼───────────────────┼────────────────────────┼────────────────────────┼─────────┤
│ 'whatwg-mimetype (new MIMEType)' │ '4968.1 ± 0.28%' │ '4719.0 ± 116.01' │ '207433 ± 0.04%'       │ '211909 ± 5293'        │ 201283  │
│ 'node:util (new MIMEType)'       │ '4800.3 ± 0.30%' │ '4616.0 ± 92.00'  │ '212402 ± 0.03%'       │ '216638 ± 4356'        │ 208319  │
│ 'content-type (parse+format)'    │ '3049.4 ± 0.39%' │ '2896.0 ± 23.00'  │ '335937 ± 0.03%'       │ '345304 ± 2763'        │ 327939  │
│ 'media-type (MediaType.parse)'   │ '2786.1 ± 0.17%' │ '2673.0 ± 54.00'  │ '365192 ± 0.02%'       │ '374111 ± 7568'        │ 358927  │
│ 'media-type (new MediaType)'     │ '2711.5 ± 0.21%' │ '2610.0 ± 31.00'  │ '374652 ± 0.02%'       │ '383142 ± 4606'        │ 368799  │
└──────────────────────────────────┴──────────────────┴───────────────────┴────────────────────────┴────────────────────────┴─────────┘
```

```
$ deno -v
deno 2.5.4
┌──────────────────────────────────┬──────────────────┬──────────────────┬────────────────────────┬────────────────────────┬─────────┐
│ Task name                        │ Latency avg (ns) │ Latency med (ns) │ Throughput avg (ops/s) │ Throughput med (ops/s) │ Samples │
├──────────────────────────────────┼──────────────────┼──────────────────┼────────────────────────┼────────────────────────┼─────────┤
│ "whatwg-mimetype (new MIMEType)" │ "5040.6 ± 0.26%" │ "4815.0 ± 75.00" │ "203920 ± 0.04%"       │ "207684 ± 3242"        │ 198390  │
│ "content-type (parse+format)"    │ "3024.4 ± 0.19%" │ "2909.0 ± 36.00" │ "337188 ± 0.02%"       │ "343761 ± 4307"        │ 330641  │
│ "media-type (MediaType.parse)"   │ "2965.6 ± 0.79%" │ "2823.0 ± 45.00" │ "345505 ± 0.03%"       │ "354233 ± 5738"        │ 337195  │
│ "media-type (new MediaType)"     │ "2802.2 ± 0.15%" │ "2716.0 ± 22.00" │ "362180 ± 0.02%"       │ "368189 ± 3007"        │ 356863  │
└──────────────────────────────────┴──────────────────┴──────────────────┴────────────────────────┴────────────────────────┴─────────┘
```

## Licensing

Copyright 2013 Lovell Fuller and contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
[https://www.apache.org/licenses/LICENSE-2.0](https://www.apache.org/licenses/LICENSE-2.0.html)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
