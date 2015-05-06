// ==UserScript==
// @name         Special Character hotkeys
// @namespace    ttps://github.com/Zvirja/SpecialCharHotkeys
// @version      1.0
// @description  Script provides hotkeys for special characters.
// @author       Alex Povar
// @grant        none
// ==/UserScript==


//Map. Each entry
var hotkeysMap = [
  {
    key: {
      code: 109,
      ctrl: true,
      shift: true,
      alt: false
    },
    character: String.fromCharCode(8212)
  }
];

var originalOnKeyUp = document.onkeyup;
document.onkeyup = function (e) {
  try {
    handleKeyPress(e);

  } catch (e) {
    console.error(e);
  }


  if (originalOnKeyUp) {
    originalOnKeyUp.apply(this, arguments);
  }
}

var handleKeyPress = function (e) {
  for (var i = 0; i < hotkeysMap.length; ++i) {
    var map = hotkeysMap[i];
    var key = map.key;

    if (e.keyCode === key.code && !!e.ctrlKey === key.ctrl && !!e.shiftKey === key.shift && !!e.altKey === key.alt) {
      insertCharacter(map.character);
      break;
    }
  }
}

var insertCharacter = function (charToPut) {
  putCharToActiveElement(document, charToPut);
}

var putCharToActiveElement = function(doc, charToPut) {
  var activeElement = doc.activeElement;

  if ("IFRAME" === activeElement.tagName) {
    putCharToActiveElement(activeElement.contentDocument, charToPut);
  }

  if (typeof activeElement.value != "undefined") {
    putCharToInput(activeElement, charToPut);
  } else {
    putCharToDocumentGeneric(doc, charToPut);
  }
};


var putCharToInput = function (activeElement, charToPut) {
  var selectionStart = activeElement.selectionStart;
  var selectionEnd = activeElement.selectionEnd;

  if (charToPut.length === 2) {
    selectionEnd++;
    insertCharToInputAtPos(activeElement, selectionStart, charToPut[0]);
    insertCharToInputAtPos(activeElement, selectionEnd, charToPut[1]);
  } else {
    insertCharToInputAtPos(activeElement, selectionEnd, charToPut);
  }

  return setCursorAtPosition(activeElement, selectionEnd + 1);
};


var putCharToDocumentGeneric = function (doc, charToPut) {
  var selection = doc.getSelection();

  var anchorNode = selection.anchorNode;
  var anchorOffset = selection.anchorOffset;
  var focusNode = selection.focusNode;
  var focusOffset = selection.focusOffset;

  if (charToPut.length === 2) {
    if (anchorNode === focusNode) {
      focusOffset++;
    }
    anchorNode.textContent = insertCharToStrAtPos(anchorNode.textContent, anchorOffset, charToPut[0]);
    focusNode.textContent = insertCharToStrAtPos(focusNode.textContent, focusOffset, charToPut[1]);

  } else {
    focusNode.textContent = insertCharToStrAtPos(focusNode.textContent, focusOffset, charToPut);
  }
  
  return selection.setPosition(focusNode, focusOffset + 1);
};

var insertCharToInputAtPos = function (elem, pos, charToPut) {
  return elem.value = insertCharToStrAtPos(elem.value, pos, charToPut);
};

var insertCharToStrAtPos = function (baseStr, pos, charToPut) {
  return baseStr.substr(0, pos) + charToPut + baseStr.substr(pos, baseStr.length);
};

var setCursorAtPosition = function (elem, pos) {
  return elem.setSelectionRange(pos, pos);
}