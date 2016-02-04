tui.util.defineNamespace("fedoc.content", {});
fedoc.content["painter_cell_button.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Painter class for the button cell\n * @author NHN Ent. FE Development Team\n */\n'use strict';\n\nvar ListCell = require('./list');\nvar util = require('../../common/util');\n\n/**\n * Painter class for the button cell\n * @module painter/cell/button\n * @extends module:painter/cell/list\n */\nvar ButtonCell = tui.util.defineClass(ListCell,/**@lends module:painter/cell/button.prototype */{\n    /**\n     * @constructs\n     */\n    init: function() {\n        ListCell.apply(this, arguments);\n        this.setKeyDownSwitch({\n            'UP_ARROW': function() {},\n            'DOWN_ARROW': function() {},\n            'PAGE_UP': function() {},\n            'PAGE_DOWN': function() {},\n            'ENTER': function(keyDownEvent, param) {\n                param.$target.trigger('click');\n            },\n            'LEFT_ARROW': function(keyDownEvent, param) {\n                this._focusPrevInput(param.$target);\n            },\n            'RIGHT_ARROW': function(keyDownEvent, param) {\n                this._focusNextInput(param.$target);\n            },\n            'ESC': function(keyDownEvent, param) {\n                this.focusOut(param.$target);\n            },\n            'TAB': function(keyDownEvent, param) {\n                if (keyDownEvent.shiftKey) {\n                    //이전 cell 로 focus 이동\n                    if (!this._focusPrevInput(param.$target)) {\n                        this.grid.focusModel.focusIn(param.rowKey, param.focusModel.prevColumnName(), true);\n                    }\n                //이후 cell 로 focus 이동\n                } else if (!this._focusNextInput(param.$target)) {\n                    this.grid.focusModel.focusIn(param.rowKey, param.focusModel.nextColumnName(), true);\n                }\n            }\n        });\n    },\n\n    eventHandler: {\n        'change input': '_onChange',\n        'keydown input': '_onKeyDown',\n        'blur input': '_onBlur'\n    },\n\n    /**\n     * 자기 자신의 인스턴스의 editType 을 반환한다.\n     * @returns {String} editType 'normal|button|select|button|text|text-password|text-convertible'\n     */\n    getEditType: function() {\n        return 'button';\n    },\n\n    /**\n     * Contents markup template\n     * @returns {string} html\n     */\n    contentTemplate: _.template(\n        '&lt;input' +\n        ' type=\"&lt;%=type%>\"' +\n        ' name=\"&lt;%=name%>\"' +\n        ' id=\"&lt;%=id%>\"' +\n        ' value=\"&lt;%=value%>\"' +\n        ' &lt;% if (isChecked) print(\"checked\"); %>' +\n        ' &lt;% if (isDisabled) print(\"disabled\"); %>' +\n        '/>'\n    ),\n\n    /**\n     * Label markup template\n     * It will be added to content\n     * @returns {string} html\n     */\n    labelTemplate: _.template(\n        '&lt;label' +\n        ' for=\"&lt;%=id%>\"' +\n        ' style=\"margin-right:10px;\"' +\n        '>' +\n        '&lt;%=labelText%>' +\n        '&lt;/label>'\n    ),\n\n    /**\n     * cell 에서 키보드 enter 를 입력했을 때 편집모드로 전환. cell 내 input 에 focus 를 수행하는 로직. 필요에 따라 override 한다.\n     * @param {jQuery} $td 해당 cell 엘리먼트\n     */\n    focusIn: function($td) {\n        /* istanbul ignore next: focus 확인 불가 */\n        if ($td.find('input').eq(0).prop('disabled')) {\n            this.grid.focusModel.focusClipboard();\n        } else {\n            $td.find('input').eq(0).focus();\n        }\n    },\n\n    /**\n     * Cell data 를 인자로 받아 &lt;td> 안에 들아갈 html string 을 반환한다.\n     * redrawAttributes 에 해당하는 프로퍼티가 변경되었을 때 수행될 로직을 구현한다.\n     * @param {object} cellData 모델의 셀 데이터\n     * @returns {string} html 마크업 문자열\n     * @example\n     * var html = this.getContentHtml();\n     * &lt;select>\n     *     &lt;option value='1'>option1&lt;/option>\n     *     &lt;option value='2'>option1&lt;/option>\n     *     &lt;option value='3'>option1&lt;/option>\n     * &lt;/select>\n     */\n    getContentHtml: function(cellData) {\n        var list = this.getOptionList(cellData),\n            columnModel = this.grid.columnModel.getColumnModel(cellData.columnName),\n            value = cellData.value,\n            checkedList = ('' + value).split(','),\n            checkedMap = {},\n            html = this._getConvertedHtml(value, cellData),\n            name = util.getUniqueKey(),\n            isDisabled = cellData.isDisabled,\n            type = columnModel.editOption.type,\n            id;\n\n        if (_.isNull(html)) {\n            html = '';\n\n            _.each(checkedList, function(item) {\n                checkedMap[item] = true;\n            });\n            _.each(list, function(item) {\n                id = name + '_' + item.value;\n                html += this.contentTemplate({\n                    type: type,\n                    name: name,\n                    id: id,\n                    value: item.value,\n                    isChecked: !!checkedMap[item.value],\n                    isDisabled: isDisabled\n                });\n                if (item.text) {\n                    html += this.labelTemplate({\n                        id: id,\n                        labelText: item.text\n                    });\n                }\n            }, this);\n        }\n        return html;\n    },\n\n    /**\n     * model의 redrawAttributes 에 해당하지 않는 프로퍼티의 변화가 발생했을 때 수행할 메서드\n     * redrawAttributes 에 해당하지 않는 프로퍼티가 변경되었을 때 수행할 로직을 구현한다.\n     * @param {object} cellData 모델의 셀 데이터\n     * @param {jQuery} $td 해당 cell 엘리먼트\n     */\n    setElementAttribute: function(cellData, $td) {\n        var value = cellData.value,\n            checkedList = ('' + value).split(',');\n\n        $td.find('input:checked').prop('checked', false);\n\n        tui.util.forEachArray(checkedList, function(item) {\n            $td.find('input[value=\"' + item + '\"]').prop('checked', true);\n        });\n    },\n\n    /**\n     * 다음 input 에 focus 한다\n     * @param {jQuery} $currentInput 현재 input jQuery 엘리먼트\n     * @returns {boolean} 다음 엘리먼트에 focus 되었는지 여부\n     * @private\n     */\n    _focusNextInput: function($currentInput) {\n        return this._focusTargetInput($currentInput, 'next');\n    },\n\n    /**\n     * 이전 input 에 focus 한다.\n     * @param {jQuery} $currentInput 현재 input jQuery 엘리먼트\n     * @returns {boolean} 다음 엘리먼트에 focus 되었는지 여부\n     * @private\n     */\n    _focusPrevInput: function($currentInput) {\n        return this._focusTargetInput($currentInput, 'prev');\n    },\n\n    /**\n     * 이전 혹은 다음 input 에 focus 한다.\n     * @param {jQuery} $currentInput 현재 input jQuery 엘리먼트\n     * @param {string} direction 방향 'next|prev'\n     * @returns {boolean} 해당 엘리먼트에 focus 되었는지 여부\n     * @private\n     */\n    _focusTargetInput: function($currentInput, direction) {\n        var $target = $currentInput,\n            result = false,\n            find;\n\n        if (direction === 'next') {\n            find = function($el) {\n                return $el.next();\n            };\n        } else if (direction === 'prev') {\n            find = function($el) {\n                return $el.prev();\n            };\n        }\n\n        do {\n            $target = find($target);\n        } while ($target.length &amp;&amp; !$target.is('input'));\n\n        if ($target.length) {\n            $target.focus();\n            result = true;\n        }\n        return result;\n    },\n\n    /**\n     * check 된 button 의 값들을 가져온다. onChange 이벤트 핸들러에서 호출한다.\n     * @param {jQuery} $target 이벤트가 발생한 targetElement\n     * @returns {Array}  check 된 값들의 결과 배열\n     * @private\n     */\n    _getCheckedValueList: function($target) {\n        var $checkedList = $target.closest('td').find('input:checked'),\n            checkedList = [];\n\n        tui.util.forEachArray($checkedList, function($checked, index) {\n            checkedList.push($checkedList.eq(index).val());\n        });\n\n        return checkedList;\n    },\n\n    /**\n     * onChange 이벤트 핸들러\n     * @param {Event} changeEvent 이벤트 객체\n     * @private\n     */\n    _onChange: function(changeEvent) {\n        var $target = $(changeEvent.target),\n            cellAddress = this._getCellAddress($target);\n        this.grid.dataModel.setValue(cellAddress.rowKey, cellAddress.columnName,\n            this._getCheckedValueList($target).join(','));\n    },\n\n    /**\n     * Event handler for 'blur' event on input element\n     * @param {Event} ev - Blur event\n     * @private\n     */\n    _onBlur: function(ev) {\n        var cellAddr = this._getCellAddress($(ev.target));\n        this._validateData(cellAddr.rowKey, cellAddr.columnName);\n    }\n});\n\nmodule.exports = ButtonCell;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"