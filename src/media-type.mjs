/*!
  Copyright 2013 Lovell Fuller and others.
  SPDX-License-Identifier: Apache-2.0
*/

function parse(val, mediaType) {
  if (typeof val !== "string") return null;
  const trimmed = val?.trim().toLowerCase();
  if (!trimmed) return null;
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex === -1) return null;

  const type = trimmed.slice(0, slashIndex);
  const remaining = trimmed.slice(slashIndex + 1);
  const semicolonIndex = remaining.indexOf(";");
  const subtype =
    semicolonIndex === -1
      ? remaining
      : remaining.slice(0, semicolonIndex).trim();
  const params = semicolonIndex === -1 ? null : remaining.slice(semicolonIndex);

  if (
    !type ||
    (type !== "*" &&
      type !== "application" &&
      type !== "audio" &&
      type !== "font" &&
      type !== "image" &&
      type !== "haptics" &&
      type !== "message" &&
      type !== "model" &&
      type !== "multipart" &&
      type !== "text" &&
      type !== "video")
  )
    return null;

  if (
    !subtype ||
    subtype.length > 127 ||
    subtype === "example" ||
    /[^a-z0-9!#$%^&*_\-+{}|'.`~]/.test(subtype)
  )
    return null;

  if (type === "*" && subtype !== "*") return null;

  mediaType.type = type;
  setSubtypeAndSuffix(mediaType, subtype);
  if (params) {
    mediaType.parameters = parseParameters(params.substring(1));
  } else {
    mediaType.parameters = new Map();
  }
  return mediaType;
}

function parseParameters(input) {
  const parameters = new Map();
  if (input.trim() === "charset=utf-8") {
    parameters.set("charset", "utf-8");
    return parameters;
  }
  const len = input.length;
  let i = 0;
  while (i < len) {
    while (i < len && (input[i] === " " || input[i] === ";")) i++;
    if (i >= len) break;

    let keyStart = i;
    while (i < len && input[i] !== "=" && input[i] !== ";") i++;
    if (i >= len) break;
    if (input[i] === ";") {
      keyStart = i + 1;
      while (i < len && input[i] !== "=") i++;
    }

    const key = input.slice(keyStart, i).trim();
    if (key.length === 0) break;
    i++; // skip '='

    while (i < len && input[i] === " ") i++;
    if (i >= len) break;

    let value;
    if (input[i] === '"') {
      i++; // skip opening quote
      const valueStart = i;
      while (i < len && input[i] !== '"') i++;
      value = input.slice(valueStart, i);
      if (i < len) i++; // skip closing quote
    } else {
      const valueStart = i;
      while (i < len && input[i] !== ";") i++;
      value = input.slice(valueStart, i).trim();
    }
    if (!parameters.has(key)) {
      let valid = true;
      for (let j = 0; j < key.length; j++) {
        const code = key.charCodeAt(j);
        if (
          !(
            (code >= 97 && code <= 122) ||
            (code >= 48 && code <= 57) ||
            code === 45
          )
        ) {
          valid = false;
          break;
        }
      }
      for (let j = 0; j < value.length; j++) {
        const code = value.charCodeAt(j);
        if (!(code >= 32 && code !== 127)) {
          valid = false;
          break;
        }
      }
      if (valid) {
        parameters.set(key, value);
      }
    }
  }
  return parameters;
}

function setSubtypeAndSuffix(mediaType, subtype) {
  mediaType.subtype = subtype;
  if (subtype) {
    const plusIndex = subtype.indexOf("+");
    if (plusIndex > -1 && plusIndex !== subtype.length - 1) {
      mediaType.subtype = subtype.slice(0, plusIndex);
      mediaType.subtypeFacets = mediaType.subtype.split(".");
      mediaType.suffix = subtype.slice(plusIndex + 1);
    } else {
      mediaType.subtypeFacets = subtype.split(".");
      mediaType.suffix = null;
    }
    mediaType.essence = mediaType.suffix
      ? `${mediaType.type}/${mediaType.subtype}+${mediaType.suffix}`
      : `${mediaType.type}/${mediaType.subtype}`;
  }
}

function MediaType(val) {
  if (val !== undefined) {
    const valid = parse(val, this);
    if (!valid) {
      throw new TypeError(`Invalid MediaType: ${val}`);
    }
  } else {
    this.type = null;
    this.subtype = null;
    this.subtypeFacets = [];
    this.suffix = null;
    this.essence = null;
    this.parameters = new Map();
  }
}

MediaType.parse = function (val) {
  return parse(val, new MediaType());
};

MediaType.prototype.isHTML = function () {
  return (
    (this.type === "text" && this.subtype === "html") ||
    (this.type === "application" &&
      (this.subtype === "xhtml+xml" || this.subtype === "html+xml"))
  );
};

MediaType.prototype.isXML = function () {
  return this.subtype === "xml" || this.suffix === "xml";
};

MediaType.prototype.isJavaScript = function () {
  return (
    (this.type === "application" || this.type === "text") &&
    ["javascript", "x-javascript", "ecmascript", "x-ecmascript"].includes(
      this.subtype,
    )
  );
};

MediaType.prototype.hasSuffix = function () {
  return !!this.suffix;
};

MediaType.prototype.isVendor = function () {
  return this.subtypeFacets.length > 0 && this.subtypeFacets[0] === "vnd";
};

MediaType.prototype.isPersonal = function () {
  return this.subtypeFacets.length > 0 && this.subtypeFacets[0] === "prs";
};

MediaType.prototype.isExperimental = function () {
  return (
    (this.subtypeFacets.length > 0 && this.subtypeFacets[0] === "x") ||
    this.subtype.substring(0, 2) === "x-"
  );
};

MediaType.prototype.toString = function () {
  if (this.parameters.size === 0) {
    return this.essence;
  }
  let result = `${this.essence};`;
  const keys = Array.from(this.parameters.keys());
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = this.parameters.get(key);
    result = `${result}${key}=${value.length === 0 || /[^a-z0-9-']/.test(value) ? `"${value.replaceAll('"', '\\"')}"` : value}`;
    if (i < keys.length - 1) {
      result = `${result};`;
    }
  }
  return result;
};

export { MediaType };
