import 'package:flutter/material.dart';

import 'app_colors.dart';

abstract final class AppTextStyles {
  static const title = TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.text, height: 1.15);
  static const heading = TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.text);
  static const body = TextStyle(fontSize: 15, height: 1.45, color: AppColors.text);
  static const muted = TextStyle(fontSize: 14, height: 1.4, color: AppColors.secondaryText);
}
