'use strict';

var _ = require('lodash');
var md5 = require('md5');
var stringify = require('json-stringify-safe');

function createStyleJsonFromString(styleString) {
    if (_.isNull(styleString) || _.isUndefined(styleString) || styleString === '') {
        return {};
    }
    var styles = styleString.split(';');
    var singleStyle, key, value, jsonStyles = {};
    for (var i = 0; i < styles.length; i++) {
        singleStyle = styles[i].split(':');
        key = _.camelCase(singleStyle[0]);
        value = singleStyle[1];
        if (key.length > 0 && value.length > 0) {
            jsonStyles[key] = value;
        }
    }
    return jsonStyles;
}

var ProcessNodeDefinitions = function(React) {
    function processDefaultNode(node, children) {
        if (node.type === 'text') {
            return node.data;
        } else if (node.type === 'comment') {
            // FIXME: The following doesn't work as the generated HTML results in "&lt;!--  This is a comment  --&gt;"
            //return '<!-- ' + node.data + ' -->';
            return false;
        }

        var elementProps = {};
        // Process attributes
        if (node.attribs) {
            _.each(node.attribs, function(value, key) {
                switch (key || '') {
                    case 'style':
                        elementProps.style = createStyleJsonFromString(node.attribs.style);
                        break;
                    case 'class':
                        elementProps.className = value;
                        break;
                    default:
                        elementProps[key] = value;
                        break;
                }
            });
        }

        if (elementProps.key == null) {
          elementProps.key = md5(stringify(node));
        }

        return React.createElement(node.name, elementProps, node.data, children);
    }

    return {
        processDefaultNode: processDefaultNode
    };
};

module.exports = ProcessNodeDefinitions;
