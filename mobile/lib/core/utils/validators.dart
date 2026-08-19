abstract final class Validators {
  static String? required(String? value, {String label = 'Ce champ'}) => value == null || value.trim().isEmpty ? '$label est obligatoire.' : null;

  static String? name(String? value, {required String label}) {
    final error = required(value, label: label);
    if (error != null) return error;
    return value!.trim().length < 2 ? '$label doit contenir au moins 2 caractères.' : null;
  }

  static String? email(String? value) {
    if (value == null || value.trim().isEmpty) return 'Veuillez saisir votre adresse email.';
    return RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(value.trim()) ? null : 'Veuillez saisir une adresse email valide.';
  }

  static String? password(String? value) {
    final error = required(value, label: 'Le mot de passe');
    if (error != null) return error;
    return value!.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères.' : null;
  }

  static String? confirmation(String? value, String original) {
    if (value == null || value.isEmpty) return 'Veuillez confirmer votre mot de passe.';
    return value == original ? null : 'Les mots de passe ne correspondent pas.';
  }

  static String? phone(String? value) {
    if (value == null || value.trim().isEmpty) return 'Le téléphone est obligatoire.';
    final digits = value.replaceAll(RegExp(r'\D'), '');
    return digits.length >= 8 && digits.length <= 15 ? null : 'Veuillez saisir un numéro de téléphone valide.';
  }
}
