String formatRelativeDate(String? isoDate) {
  if (isoDate == null || isoDate.isEmpty) return '';

  final date = DateTime.tryParse(isoDate);
  if (date == null) return isoDate;

  final now = DateTime.now();
  final diff = now.difference(date);

  if (diff.isNegative) return 'À l\'instant';

  if (diff.inMinutes < 1) return 'À l\'instant';
  if (diff.inMinutes < 60) return 'Il y a ${diff.inMinutes} min';
  if (diff.inHours < 24) return 'Il y a ${diff.inHours}h';
  if (diff.inDays == 1) return 'Hier';
  if (diff.inDays < 7) return 'Il y a ${diff.inDays} jours';
  if (diff.inDays < 30) return 'Il y a ${(diff.inDays / 7).floor()} sem.';

  const months = [
    'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
    'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
  ];
  return 'Le ${date.day} ${months[date.month - 1]} ${date.year}';
}

String formatTime(DateTime date) {
  final h = date.hour.toString().padLeft(2, '0');
  final m = date.minute.toString().padLeft(2, '0');
  return '$h:$m';
}
