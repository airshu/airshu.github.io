---
title: QListWidget
tags: Qt
---









### 一些技巧

#### 让QListWidget的高度跟着内容的高度变化

```Python
from PySide import QtGui, QtCore

app = QtGui.QApplication([])

window = QtGui.QWidget()
layout = QtGui.QVBoxLayout(window)
list = QtGui.QListWidget()
list.addItems(['Winnie Puh', 'Monday', 'Tuesday', 'Minnesota', 'Dracula Calista Flockhart Meningitis', 'Once', '123345', 'Fin'])
list.setHorizontalScrollBarPolicy(QtCore.Qt.ScrollBarAlwaysOff)
list.setVerticalScrollBarPolicy(QtCore.Qt.ScrollBarAlwaysOff)
list.setFixedSize(list.sizeHintForColumn(0) + 2 * list.frameWidth(), list.sizeHintForRow(0) * list.count() + 2 * list.frameWidth())
layout.addWidget(list)

window.show()

app.exec_()
```


**参考**

- [https://stackoverflow.com/questions/6337589/qlistwidget-adjust-size-to-content](https://stackoverflow.com/questions/6337589/qlistwidget-adjust-size-to-content)
