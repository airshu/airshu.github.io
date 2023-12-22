---
title: Path的使用
toc: true
tags: Flutter
---


```dart

/// rect    圆弧所在的矩形
/// startAngle  初始化弧度
/// sweepAngle  需要绘制的弧度大小
/// forceMoveTo 是否强制连线
void arcTo(Rect rect, double startAngle, double sweepAngle, bool forceMoveTo) {
}



class ArcWidget extends StatefulWidget {
  const ArcWidget({super.key});

  @override
  State<ArcWidget> createState() => _ArcWidgetState();
}

class _ArcWidgetState extends State<ArcWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 50.h,
      child: CustomPaint(
        painter: ArcPainter(),
        child: Container(),
      ),
    );
  }
}

class ArcPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(0, size.height + 1) // Start at the bottom-left corner
      ..lineTo(0, size.height - 10.h) // Move up by 100 pixels
      ..quadraticBezierTo(size.width / 2, size.height - 48.h, size.width, size.height - 10.h) // Draw a quadratic bezier curve
      ..lineTo(size.width, size.height + 1) // Draw a line to the bottom-right corner
      ..close(); // Close the path

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}


```
