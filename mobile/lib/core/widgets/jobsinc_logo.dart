import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class JobsincLogo extends StatelessWidget {
  const JobsincLogo({super.key, this.light = false});

  final bool light;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: light ? Colors.white24 : AppColors.primary,
            borderRadius: BorderRadius.circular(13),
          ),
          child: const Icon(Icons.work_rounded, color: Colors.white, size: 24),
        ),
        const SizedBox(width: 10),
        Text(
          'JOBSINC',
          style: TextStyle(
            color: light ? Colors.white : AppColors.navy,
            fontSize: 22,
            fontWeight: FontWeight.w900,
            letterSpacing: 1,
          ),
        ),
      ],
    );
  }
}
