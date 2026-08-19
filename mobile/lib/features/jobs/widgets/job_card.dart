import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../models/job_offer.dart';

class JobCard extends StatelessWidget {
  const JobCard({super.key, required this.offer, this.onTap, this.onSave});

  final JobOffer offer;
  final VoidCallback? onTap;
  final VoidCallback? onSave;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const CircleAvatar(backgroundColor: AppColors.navy, child: Icon(Icons.business_rounded, color: Colors.white)),
                  const SizedBox(width: 12),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(offer.title, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.text)), const SizedBox(height: 4), Text(offer.company, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(color: AppColors.secondaryText))])),
                  if (onSave != null) IconButton(tooltip: 'Sauvegarder l’offre', onPressed: onSave, icon: const Icon(Icons.bookmark_border)),
                ],
              ),
              const SizedBox(height: 14),
              Wrap(spacing: 8, runSpacing: 8, children: [
                if (offer.location.isNotEmpty) _OfferTag(icon: Icons.location_on_outlined, label: offer.location),
                if (offer.type.isNotEmpty) _OfferTag(icon: Icons.work_outline, label: offer.type),
                if (offer.salary != null) _OfferTag(icon: Icons.payments_outlined, label: offer.salary!),
                if (offer.matchScore != null) _OfferTag(icon: Icons.auto_awesome_outlined, label: '${offer.matchScore}% compatible'),
              ]),
              const Spacer(),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Expanded(child: Text(offer.posted, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, color: AppColors.secondaryText))),
                TextButton.icon(onPressed: onTap, icon: const Icon(Icons.arrow_forward_rounded, size: 16), label: const Text('Consulter')),
              ]),
            ],
          ),
        ),
      ),
    );
  }
}

class _OfferTag extends StatelessWidget {
  const _OfferTag({required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(8)),
        child: Row(mainAxisSize: MainAxisSize.min, children: [Icon(icon, size: 15, color: AppColors.secondaryText), const SizedBox(width: 5), Text(label, style: const TextStyle(fontSize: 12, color: AppColors.secondaryText))]),
      );
}
