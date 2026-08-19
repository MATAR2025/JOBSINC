import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class AppButton extends StatelessWidget {
  const AppButton({super.key, required this.label, required this.onPressed, this.outline = false, this.icon});
  final String label;
  final VoidCallback? onPressed;
  final bool outline;
  final IconData? icon;
  @override
  Widget build(BuildContext context) {
    final child = Row(mainAxisAlignment: MainAxisAlignment.center, mainAxisSize: MainAxisSize.min, children: [if (icon != null) ...[Icon(icon, size: 18), const SizedBox(width: 8)], Text(label)]);
    return SizedBox(width: double.infinity, height: 52, child: outline ? OutlinedButton(onPressed: onPressed, style: OutlinedButton.styleFrom(foregroundColor: AppColors.primary, side: const BorderSide(color: AppColors.primary), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))), child: child) : FilledButton(onPressed: onPressed, style: FilledButton.styleFrom(backgroundColor: AppColors.primary, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))), child: child));
  }
}
