var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styled from '@emotion/styled';
var ListContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin: 20px 0;\n  padding: 15px;\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n"], ["\n  margin: 20px 0;\n  padding: 15px;\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n"])));
var ListItem = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 10px;\n  margin: 5px 0;\n  background: #f3f4f6;\n  border-radius: 4px;\n  \n  &:hover {\n    background: #e5e7eb;\n  }\n"], ["\n  padding: 10px;\n  margin: 5px 0;\n  background: #f3f4f6;\n  border-radius: 4px;\n  \n  &:hover {\n    background: #e5e7eb;\n  }\n"])));
var Button = styled.button(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 8px 16px;\n  margin: 8px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n\n  &:hover {\n    background: #1d4ed8;\n  }\n"], ["\n  padding: 8px 16px;\n  margin: 8px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n\n  &:hover {\n    background: #1d4ed8;\n  }\n"])));
var LazyList = function () {
    var _a = useState([]), items = _a[0], setItems = _a[1];
    var addItem = function () {
        var newItem = {
            id: items.length + 1,
            text: "Lazy Item ".concat(items.length + 1)
        };
        setItems(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newItem], false); });
    };
    return (_jsxs(ListContainer, { children: [_jsx("h2", { children: "Lazy Loaded List" }), _jsx(Button, { onClick: addItem, children: "Add Item" }), items.map(function (item) { return (_jsx(ListItem, { children: item.text }, item.id)); })] }));
};
export default LazyList;
var templateObject_1, templateObject_2, templateObject_3;
