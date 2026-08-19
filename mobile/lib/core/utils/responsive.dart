import 'package:flutter/widgets.dart';

abstract final class Responsive {
  static const tabletBreakpoint = 600.0;
  static const desktopBreakpoint = 900.0;
  static bool isTablet(BuildContext context) => MediaQuery.sizeOf(context).width >= tabletBreakpoint;
  static bool isDesktop(BuildContext context) => MediaQuery.sizeOf(context).width >= desktopBreakpoint;
  static double pagePadding(BuildContext context) { final width = MediaQuery.sizeOf(context).width; if (width >= desktopBreakpoint) return 48; if (width >= tabletBreakpoint) return 32; return 20; }
}
