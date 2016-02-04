tui.util.defineNamespace("fedoc.content", {});
fedoc.content["model_rowList.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview RowList 클래스파일\n * @author NHN Ent. FE Development Team\n */\n'use strict';\n\nvar Collection = require('../base/collection');\nvar Row = require('./row');\n\n/**\n  * View Model rowList collection\n  * @module model/rowList\n  * @extends module:base/collection\n  */\nvar RowList = Collection.extend(/**@lends module:model/rowList.prototype */{\n    model: Row,\n    /**\n     * @constructs\n     * @param {Object} rawData - Raw data\n     * @param {Object} options - Options\n     */\n    initialize: function(rawData, options) {\n        this.setOwnProperties({\n            dataModel: options.dataModel,\n            columnModel: options.columnModel\n        });\n    }\n});\n\nmodule.exports = RowList;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"