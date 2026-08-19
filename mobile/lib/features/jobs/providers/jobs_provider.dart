import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/services/api_client.dart';
import '../models/job_offer.dart';

final jobsRepositoryProvider = Provider<JobsRepository>(
  (ref) => JobsRepository(),
);

final jobsProvider = FutureProvider.autoDispose<List<JobOffer>>(
  (ref) async {
    return ref.watch(jobsRepositoryProvider).loadJobs();
  },
);

class JobsRepository {
  JobsRepository({ApiClient? api}) : _api = api ?? ApiClient();

  final ApiClient _api;

  Future<List<JobOffer>> loadJobs() async {
    final response = await _api.get('/jobs');

    final data = response['data'] as List<dynamic>? ?? const [];

    return data
        .whereType<Map<String, dynamic>>()
        .map(JobOffer.fromJson)
        .where((job) => job.title.isNotEmpty)
        .toList(growable: false);
  }
}
