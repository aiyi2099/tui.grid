/**
 * @fileoverview CellPainter 의 기초 클래스
 * @author NHN Ent. FE Development Team
 */
'use strict';

var Painter = require('../../base/painter');
var util = require('../../common/util');
var keyNameMap = require('../../common/constMap').keyName;
var formUtil = require('../../common/formUtil');

/**
 * Cell Painter Base
 * @module painter/cell
 * @extends module:base/painter
 */
var TextInput = tui.util.defineClass(Painter, /**@lends module:painter/cell.prototype */{
    /**
     * @constructs
     * @param {Object} options - options
     */
    init: function(options) {
        Painter.apply(this, arguments);
        this.editType = options.editType;
    },

    /**
     * Markup template
     * @returns {string} html
     */
    template: _.template(
        '<input' +
        ' type="<%=type%>"' +
        ' value="<%=value%>"' +
        ' name="<%=name%>"' +
        ' align="center"' +
        ' maxLength="<%=maxLength%>"' +
        ' <% if (isDisabled) print("disabled"); %>' +
        '/>'
    ),

    eventHandler: {
        'blur input': '_onBlur',
        'keydown input': '_onKeyDown',
        'focus input': '_onFocus',
        'selectstart input': '_onSelectStart'
    },

    /**
     * 인자로 받은 element 로 부터 rowKey 와 columnName 을 반환한다.
     * @param {jQuery} $target 조회할 엘리먼트
     * @returns {{rowKey: String, columnName: String}} rowKey 와 columnName 정보
     * @private
     */
    _getCellAddress: function($target) {
        return {
            rowKey: $target.closest('tr').attr('key'),
            columnName: $target.closest('td').attr('columnName')
        };
    },

    /**
     * event 객체가 발생한 셀을 찾아 editOption에 inputEvent 핸들러 정보가 설정되어 있으면
     * 해당 이벤트 핸들러를 호출해준다.
     * @param {Event} event - 이벤트 객체
     * @param {string} eventType - The type of the event.
     *     This value is required to clarify the type because the `event.type` of the 'focus' event
     *     can be 'focusin' and the 'blur' event can be 'focusout'
     * @returns {boolean} Return value of the event handler. Null if there's no event handler.
     * @private
     */
    _executeCustomEventHandler: function(event) {
        var $input = $(event.target),
            cellInfo = this._getCellAddress($input);

        return this.controller.executeCustomInputEventHandler(event, cellInfo);
    },

    /**
     * focus 이벤트 핸들러
     * @param {Event} event 이벤트 객체
     * @private
     */
    _onFocus: function(event) {
        var address = this._getCellAddress($(event.target));

        this._executeCustomEventHandler(event, 'focus');
        this.controller.endSelection();
        this.controller.focusIn(address.rowKey, address.columnName);
    },

    /**
     * blur 이벤트 핸들러
     * @param {Event} blurEvent 이벤트 객체
     * @private
     */
    _onBlur: function(blurEvent) {
        var $target = $(blurEvent.target),
            address = this._getCellAddress($target);

        this._executeCustomEventHandler(blurEvent, 'blur');
        this.controller.setValue(address.rowKey, address.columnName, $target.val());
        this.controller.enableSelection();
        this.controller.validateCell(address.rowKey, address.columnName);
    },

    /**
     * keydown 이벤트 핸들러
     * @param  {KeyboardEvent} event 키보드 이벤트 객체
     * @private
     */
    _onKeyDown: function(event) {
        var keyCode = event.keyCode || event.which,
            keyName = keyNameMap[keyCode];
            // $target = $(event.target);

        this._executeCustomEventHandler(event, 'keydown');
        switch (keyName) {
            case 'ESC':
            case 'ENTER':
                this.controller.focusOut(true);
                break;
            case 'TAB':
                this.controller.focusInNext(event.shiftKey);
                break;
            default:
                // do nothing
        }
    },

    /**
     * selectstart 이벤트 핸들러
     * IE에서 selectstart 이벤트가 Input 요소에 까지 적용되어 값에 셀렉션 지정이 안되는 문제를 해결
     * @param {Event} event 이벤트 객체
     * @private
     */
    _onSelectStart: function(event) {
        event.stopPropagation();
    },

    /**
     * Row Painter 에서 한번에 table 을 랜더링 할 때 사용하기 위해
     * td 단위의 html 문자열을 반환한다.
     * @param {object} cellData Model 의 셀 데이터
     * @returns {string} td 마크업 문자열
     */
    getHtml: function(cellData) {
        var maxLength = tui.util.pick(cellData, 'columnModel', 'editOption', 'maxLength');

        return this.template({
            type: 'text',
            value: cellData.value,
            name: util.getUniqueKey(),
            isDisabled: cellData.isDisabled,
            maxLength: maxLength
        });
    },

    focus: function($td) {
        var $input = $td.find('input');
        formUtil.setCursorToEnd($input.get(0));
        $input.select();
    }
});

module.exports = TextInput;
