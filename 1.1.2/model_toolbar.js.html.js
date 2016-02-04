tui.util.defineNamespace("fedoc.content", {});
fedoc.content["model_toolbar.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Toolbar model class\n * @author NHN Ent. FE Development Team\n */\n'use strict';\n\nvar Model = require('../base/model'),\n    util = require('../common/util');\n\n/**\n * Toolbar Model\n * @module model/toolbar\n * @extends module:base/model\n */\nvar Toolbar = Model.extend(/**@lends module:model/toolbar.prototype */{\n    /**\n     * @constructs\n     * @param  {object} options - Options\n     */\n    initialize: function(options) {\n        Model.prototype.initialize.apply(this, arguments);\n    },\n\n    defaults: {\n        // set by user\n        hasControlPanel: false,\n        hasPagination: false,\n        hasResizeHandler: false,\n\n        // for control panel\n        isExcelButtonVisible: false,\n        isExcelAllButtonVisible: false,\n\n        // tui.component.pagination\n        pagination: null\n    },\n\n    /**\n     * Returns whether the toolbar is visible\n     * @returns {Boolean} True if the toolbar is visible\n     */\n    isVisible: function() {\n        return this.get('hasControlPanel') || this.get('hasPagination') || this.get('hasResizeHandler');\n    }\n});\n\nmodule.exports = Toolbar;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"