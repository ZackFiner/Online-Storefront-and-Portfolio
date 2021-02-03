const sanitizeHtml = require('sanitize-html');
const sanitize = require('mongo-sanitize')

function sanitizeForTinyMCE(content) {
    return sanitizeHtml(content, {
        allowedTags: [
            "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
            "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
            "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
            "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
            "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
            "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
            "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr",
            "del", "ins"
        ],
        allowedAttributes: {
            a: [ 'href', 'name', 'target' ],
            p: [ 'style' ],
            img: [ 'src' ]
        },
        allowedStyles: {// prevent CSS injection
            '*': {
                'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/], // only alow colors specified with hex or rgb
                'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],// permit text alignment settings
                'font-size': [/^\d+(?:px|em|%)$/] // permit font-size formatting options
            }
        }
    })
}

function sanitizeForMongo(content) {
    return sanitize(content);
}

class ObjectSanitizer {
    constructor(santizerDict) {
        if (santizerDict)
            this.sanitizers = santizerDict;
        else
            this.sanitizers = {};
    }

    attachSanitizer(property, santizerFunc) {
        this.sanitizers[property] = santizerFunc;
    }

    sanitizeObject(obj) {
        let sanitized_obj = {};
        for(const [prop, val] of Object.entries(this.sanitizers)) {
            if(obj.hasOwnProperty(prop))
                sanitized_obj[prop] = val(obj[prop]);
        }
        return sanitized_obj;
    }
}

module.exports = {
    sanitizeForTinyMCE,
    sanitizeForMongo,
    ObjectSanitizer,
    sanitizeHtml
}