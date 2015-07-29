/**
 * @fileoverview 리스트 형태의 Cell(select, radio, checkbox) Painter 가 정의된 파일
 * @author NHN Ent. FE Development Team
 */
/**
 * editOption 에 list 를 가지고 있는 형태의 추상 클래스
 * @implements {View.Base.Painter.Cell.Interface}
 * @constructor View.Painter.Cell.List
 */
View.Painter.Cell.List = View.Base.Painter.Cell.extend(/**@lends View.Painter.Cell.List.prototype */{
    redrawAttributes: ['isDisabled', 'isEditable', 'optionList'],
    eventHandler: {
    },
    /**
     * 생성자 메서드
     */
    initialize: function() {
        View.Base.Painter.Cell.prototype.initialize.apply(this, arguments);
    },
    /**
     * 자기 자신의 인스턴스의 editType 을 반환한다.
     * @return {String} editType 'normal|button|select|button|text|text-password|text-convertible'
     */
    getEditType: function() {},
    /**
     * cell 에서 키보드 enter 를 입력했을 때 편집모드로 전환. cell 내 input 에 focus 를 수행하는 로직. 필요에 따라 override 한다.
     * @param {jQuery} $td 해당 cell 엘리먼트
     */
    focusIn: function($td) {},
    /**
     * Cell data 를 인자로 받아 <td> 안에 들아갈 html string 을 반환한다.
     * redrawAttributes 에 해당하는 프로퍼티가 변경되었을 때 수행될 로직을 구현한다.
     * @param {object} cellData 모델의 셀 데이터
     * @return  {string} html 마크업 문자열
     * @example
     * var html = this.getContentHtml();
     * <select>
     *     <option value='1'>option1</option>
     *     <option value='2'>option1</option>
     *     <option value='3'>option1</option>
     * </select>
     */
    getContentHtml: function(cellData) {
        throw this.error('Implement getContentHtml(cellData, $target) method. On re-rendering');
    },
    /**
     * model의 redrawAttributes 에 해당하지 않는 프로퍼티의 변화가 발생했을 때 수행할 메서드
     * redrawAttributes 에 해당하지 않는 프로퍼티가 변경되었을 때 수행할 로직을 구현한다.
     * @param {object} cellData 모델의 셀 데이터
     * @param {jQuery} $td 해당 cell 엘리먼트
     * @param {Boolean} hasFocusedElement 해당 셀에 실제 focus 된 엘리먼트가 존재하는지 여부
     */
    setElementAttribute: function(cellData, $td, hasFocusedElement) {
        throw this.error('Implement setElementAttribute(cellData, $target) method. ');
    },
    /**
     * List Type 의 option list 를 반환하는 메서드
     *
     * cellData 의 optionsList 가 존재한다면 cellData 의 옵션 List 를 반환하고,
     * 그렇지 않다면 columnModel 의 optionList 를 반환한다.
     * @param {Object} cellData 모델의 셀 데이터
     * @return {Array} 옵션 리스트
     */
    getOptionList: function(cellData) {
        var columnModel = this.grid.columnModel.getColumnModel(cellData.columnName);
        return cellData.optionList && cellData.optionList.length ? cellData.optionList : columnModel.editOption.list;
    }
});

/**
 * select type 의 Cell renderer
 *
 * @extends {View.Painter.Cell.List}
 * @constructor View.Painter.Cell.List.Select
 */
View.Painter.Cell.List.Select = View.Painter.Cell.List.extend(/**@lends View.Painter.Cell.List.Select.prototype */{
    /**
     * 생성자 메서드
     */
    initialize: function() {
        View.Painter.Cell.List.prototype.initialize.apply(this, arguments);

        this.setKeyDownSwitch({
            'ESC': function(keyDownEvent, param) {
                this.focusOut(param.$target);
            },
            'ENTER': function(keyDownEvent, param) {
                this.focusOut(param.$target);
            }
        });
    },
    eventHandler: {
        'change select': '_onChange',
        'keydown select': '_onKeyDown'
    },
    /**
     * 자기 자신의 인스턴스의 editType 을 반환한다.
     * @return {String} editType 'normal|button|select|button|text|text-password|text-convertible'
     */
    getEditType: function() {
        return 'select';
    },
    /**
     * cell 에서 키보드 enter 를 입력했을 때 편집모드로 전환. cell 내 input 에 focus 를 수행하는 로직. 필요에 따라 override 한다.
     * @param {jQuery} $td 해당 cell 엘리먼트
     */
    focusIn: function($td) {
        /* istanbul ignore next */
        if ($td.find('select').prop('disabled')) {
            this.grid.focusClipboard();
        } else {
            $td.find('select').eq(0).focus();
        }
    },
    /**
     * Cell data 를 인자로 받아 <td> 안에 들아갈 html string 을 반환한다.
     * redrawAttributes 에 해당하는 프로퍼티가 변경되었을 때 수행될 로직을 구현한다.
     * @param {object} cellData 모델의 셀 데이터
     * @return  {string} html 마크업 문자열
     * @example
     * var html = this.getContentHtml();
     * <select>
     *     <option value='1'>option1</option>
     *     <option value='2'>option1</option>
     *     <option value='3'>option1</option>
     * </select>
     */
    getContentHtml: function(cellData) {
        var list = this.getOptionList(cellData),
            isDisabled = cellData.isDisabled,
            htmlArr = [],
            html = this._getConvertedHtml(cellData.value, cellData);

        if (ne.util.isNull(html)) {
            htmlArr.push('<select name="' + Util.getUniqueKey() + '"');
            htmlArr.push(isDisabled ? ' disabled ' : '');
            htmlArr.push('>');

            ne.util.forEachArray(list, function(item) {
                htmlArr.push('<option ');
                htmlArr.push('value="' + item.value + '"');
                //option의 value 는 문자열 형태인데, cellData 의 변수 type과 관계없이 비교하기 위해 == 연산자를 사용함
                if (cellData.value == item.value) {
                    htmlArr.push(' selected');
                }
                htmlArr.push(' >');
                htmlArr.push(item.text);
                htmlArr.push('</option>');
            });
            htmlArr.push('</select>');
            html = htmlArr.join('');
        }
        return html;
    },

    /**
     * 각 셀 페인터 인스턴스마다 정의된 getContentHtml 을 이용하여
     * 컬럼모델의 defaultValue, beforeText, afterText 를 적용한 content html 마크업 스트링 을 반환한다.
     * (Input의 width를 beforeText와 afterText의 유무에 관계없이 100%로 유지하기 위해 마크업이 달라져야 하기 때문에
     * View.Base.Painter.Cell로부터 override 해서 구현함)
     * @param {object} cellData Model 의 셀 데이터
     * @return {string} 컬럼모델의 defaultValue, beforeText, afterText 를 적용한 content html 마크업 스트링
     * @private
     * @override
     */
    _getContentHtml: function(cellData) {
        var columnName = cellData.columnName,
            columnModel = this.grid.columnModel.getColumnModel(columnName),
            editOption = columnModel.editOption || {},
            content = '',
            beforeContent, afterContent;

        if (!ne.util.isExisty(cellData.value)) {
            cellData.value = columnModel.defaultValue;
        }
        beforeContent = this._getExtraContent(editOption.beforeContent || editOption.beforeText, cellData);
        afterContent = this._getExtraContent(editOption.afterContent || editOption.afterText, cellData);

        if (beforeContent) {
            content += this._getSpanWrapContent(beforeContent, 'before', cellData);
        }
        if (afterContent) {
            content += this._getSpanWrapContent(afterContent, 'after', cellData);
        }
        content += this._getSpanWrapContent(this.getContentHtml(cellData), 'input');

        return content;
    },

    /**
     * model의 redrawAttributes 에 해당하지 않는 프로퍼티의 변화가 발생했을 때 수행할 메서드
     * redrawAttributes 에 해당하지 않는 프로퍼티가 변경되었을 때 수행할 로직을 구현한다.
     * @param {object} cellData 모델의 셀 데이터
     * @param {jquery} $td 해당 cell 엘리먼트
     * @param {Boolean} hasFocusedElement 해당 셀에 실제 focus 된 엘리먼트가 존재하는지 여부
     */
    setElementAttribute: function(cellData, $td, hasFocusedElement) {
        var $select = $td.find('select');
        /*
        키보드 상하로 조작시 onChange 콜백에서 false 리턴시 이전 값으로
        돌아가지 않는 현상때문에 blur focus 를 수행한다.
         */

        /* istanbul ignore next: blur 확인 불가 */
        if (hasFocusedElement) {
            $select.blur();
        }
        $select.val(cellData.value);

        /* istanbul ignore next: focus 확인 불가 */
        if (hasFocusedElement) {
            $select.focus();
        }
    },
    /**
     * change 이벤트 핸들러
     * @param {Event} changeEvent   이벤트 객체
     * @private
     */
    _onChange: function(changeEvent) {
        var $target = $(changeEvent.target),
            cellAddr = this._getCellAddress($target),
            grid = this.grid;
        grid.setValue(cellAddr.rowKey, cellAddr.columnName, $target.val());
    }
});


/**
 * checkbox, radio button type 의 Cell renderer
 *
 * @extends {View.Painter.Cell.List}
 * @constructor View.Painter.Cell.List.Button
 */
View.Painter.Cell.List.Button = View.Painter.Cell.List.extend(/**@lends View.Painter.Cell.List.Button.prototype */{
    /**
     * 생성자 함수
     */
    initialize: function() {
        View.Painter.Cell.List.prototype.initialize.apply(this, arguments);
        this.setKeyDownSwitch({
            'UP_ARROW': function() {},
            'DOWN_ARROW': function() {},
            'PAGE_UP': function() {},
            'PAGE_DOWN': function() {},
            'ENTER': function(keyDownEvent, param) {
                param.$target.trigger('click');
            },
            'LEFT_ARROW': function(keyDownEvent, param) {
                this._focusPrevInput(param.$target);
            },
            'RIGHT_ARROW': function(keyDownEvent, param) {
                this._focusNextInput(param.$target);
            },
            'ESC': function(keyDownEvent, param) {
                this.focusOut(param.$target);
            },
            'TAB': function(keyDownEvent, param) {
                if (keyDownEvent.shiftKey) {
                    //이전 cell 로 focus 이동
                    if (!this._focusPrevInput(param.$target)) {
                        this.grid.focusIn(param.rowKey, param.focusModel.prevColumnName(), true);
                    }
                } else {
                    //이후 cell 로 focus 이동
                    if (!this._focusNextInput(param.$target)) {
                        this.grid.focusIn(param.rowKey, param.focusModel.nextColumnName(), true);
                    }
                }
            }
        });
    },
    eventHandler: {
        'change input': '_onChange',
        'keydown input': '_onKeyDown'
    },
    /**
     * 자기 자신의 인스턴스의 editType 을 반환한다.
     * @return {String} editType 'normal|button|select|button|text|text-password|text-convertible'
     */
    getEditType: function() {
        return 'button';
    },
    /**
     * cell 에서 키보드 enter 를 입력했을 때 편집모드로 전환. cell 내 input 에 focus 를 수행하는 로직. 필요에 따라 override 한다.
     * @param {jQuery} $td 해당 cell 엘리먼트
     */
    focusIn: function($td) {
        /* istanbul ignore next: focus 확인 불가 */
        if ($td.find('input').eq(0).prop('disabled')) {
            this.grid.focusClipboard();
        } else {
            $td.find('input').eq(0).focus();
        }
    },
    /**
     * Cell data 를 인자로 받아 <td> 안에 들아갈 html string 을 반환한다.
     * redrawAttributes 에 해당하는 프로퍼티가 변경되었을 때 수행될 로직을 구현한다.
     * @param {object} cellData 모델의 셀 데이터
     * @return  {string} html 마크업 문자열
     * @example
     * var html = this.getContentHtml();
     * <select>
     *     <option value='1'>option1</option>
     *     <option value='2'>option1</option>
     *     <option value='3'>option1</option>
     * </select>
     */
    getContentHtml: function(cellData) {
        var list = this.getOptionList(cellData),
            columnModel = this.grid.columnModel.getColumnModel(cellData.columnName),
            value = cellData.value,
            checkedList = ('' + value).split(','),
            checkedMap = {},
            html = this._getConvertedHtml(value, cellData),
            htmlArr = [],
            name = Util.getUniqueKey(),
            isDisabled = cellData.isDisabled,
            id;

        if (ne.util.isNull(html)) {
            ne.util.forEachArray(checkedList, function(item) {
                checkedMap[item] = true;
            });

            ne.util.forEachArray(list, function(item) {
                id = name + '_' + item.value;

                htmlArr.push('<input type="');
                htmlArr.push(columnModel.editOption.type);
                htmlArr.push('" name="');
                htmlArr.push(name);
                htmlArr.push('" id="');
                htmlArr.push(id);
                htmlArr.push('" value="');
                htmlArr.push(item.value);
                htmlArr.push('" ');
                htmlArr.push(checkedMap[item.value] ? 'checked' : '');
                htmlArr.push(isDisabled ? 'disabled' : '');
                htmlArr.push('/>');

                if (item.text) {
                    htmlArr.push('<label for="');
                    htmlArr.push(id);
                    htmlArr.push('" style="margin-right:10px">');
                    htmlArr.push(item.text);
                    htmlArr.push('</label>');
                }
            }, this);
            html = htmlArr.join('');
        }
        return html;
    },
    /**
     * model의 redrawAttributes 에 해당하지 않는 프로퍼티의 변화가 발생했을 때 수행할 메서드
     * redrawAttributes 에 해당하지 않는 프로퍼티가 변경되었을 때 수행할 로직을 구현한다.
     * @param {object} cellData 모델의 셀 데이터
     * @param {jquery} $td 해당 cell 엘리먼트
     */
    setElementAttribute: function(cellData, $td) {
        var value = cellData.value,
            checkedList = ('' + value).split(',');

        $td.find('input:checked').prop('checked', false);

        ne.util.forEachArray(checkedList, function(item) {
            $td.find('input[value="' + item + '"]').prop('checked', true);
        });
    },
    /**
     * 다음 input 에 focus 한다
     * @param {jQuery} $currentInput 현재 input jQuery 엘리먼트
     * @return {boolean} 다음 엘리먼트에 focus 되었는지 여부
     * @private
     */
    _focusNextInput: function($currentInput) {
        return this._focusTargetInput($currentInput, 'next');
    },
    /**
     * 이전 input 에 focus 한다.
     * @param {jQuery} $currentInput 현재 input jQuery 엘리먼트
     * @return {boolean} 다음 엘리먼트에 focus 되었는지 여부
     * @private
     */
    _focusPrevInput: function($currentInput) {
        return this._focusTargetInput($currentInput, 'prev');
    },
    /**
     * 이전 혹은 다음 input 에 focus 한다.
     * @param {jQuery} $currentInput 현재 input jQuery 엘리먼트
     * @param {string} direction 방향 'next|prev'
     * @return {boolean} 해당 엘리먼트에 focus 되었는지 여부
     * @private
     */
    _focusTargetInput: function($currentInput, direction) {
        var $target = $currentInput,
            find;

        if (direction === 'next') {
            find = function($target) {
                return $target.next();
            };
        } else if (direction === 'prev') {
            find = function($target) {
                return $target.prev();
            };
        }

        do {
            $target = find($target);
        } while ($target.length && !$target.is('input'));

        if ($target.length) {
            $target.focus();
            return true;
        } else {
            return false;
        }
    },
    /**
     * check 된 button 의 값들을 가져온다. onChange 이벤트 핸들러에서 호출한다.
     * @param {jQuery} $target 이벤트가 발생한 targetElement
     * @return {Array}  check 된 값들의 결과 배열
     * @private
     */
    _getCheckedValueList: function($target) {
        var $checkedList = $target.closest('td').find('input:checked'),
            checkedList = [];

        ne.util.forEachArray($checkedList, function($checked, index) {
            checkedList.push($checkedList.eq(index).val());
        });

        return checkedList;
    },
    /**
     * onChange 이벤트 핸들러
     * @param {Event} changeEvent 이벤트 객체
     * @private
     */
    _onChange: function(changeEvent) {
        var $target = $(changeEvent.target),
            cellAddress = this._getCellAddress($target);
        this.grid.setValue(cellAddress.rowKey, cellAddress.columnName, this._getCheckedValueList($target).join(','));
    }
});
