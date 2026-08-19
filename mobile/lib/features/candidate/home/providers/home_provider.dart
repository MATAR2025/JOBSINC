import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/home_repository.dart';

final homeRepositoryProvider = Provider<HomeRepository>((ref) => HomeRepository());

final homeDashboardProvider = FutureProvider.autoDispose.family<HomeDashboardData, String>((ref, token) {
  return ref.watch(homeRepositoryProvider).load(token);
});
