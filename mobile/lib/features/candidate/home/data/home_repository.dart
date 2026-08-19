import '../../../../core/services/api_client.dart';
import '../../../jobs/models/job_offer.dart';

class HomeDashboardData {
  const HomeDashboardData({
    required this.jobs,
    required this.companies,
    required this.applications,
    this.upcomingInterview,
    this.profileCompletion = 0,
    this.profileViews = 0,
    this.unreadMessagesCount = 0,
    this.savedJobs = const [],
    this.careerTips = const [],
  });

  final List<JobOffer> jobs;
  final List<HomeCompany> companies;
  final List<HomeApplication> applications;
  
  final HomeInterview? upcomingInterview;
  final int profileCompletion;
  final int profileViews;
  final int unreadMessagesCount;
  final List<JobOffer> savedJobs;
  final List<HomeCareerTip> careerTips;
}

class HomeInterview {
  const HomeInterview({required this.companyName, required this.date, required this.jobTitle, this.meetLink});
  final String companyName;
  final DateTime date;
  final String jobTitle;
  final String? meetLink;
}

class HomeCareerTip {
  const HomeCareerTip({required this.title, required this.description, required this.imageUrl});
  final String title;
  final String description;
  final String imageUrl;
}

class HomeCompany {
  const HomeCompany({required this.id, required this.name, this.location, this.sector, this.logoUrl});

  final String id;
  final String name;
  final String? location;
  final String? sector;
  final String? logoUrl;

  factory HomeCompany.fromJson(Map<String, dynamic> json) {
    final images = (json['images'] as List<dynamic>? ?? const [])
        .whereType<Map<String, dynamic>>()
        .toList(growable: false);
    final primaryImage = images.cast<Map<String, dynamic>?>().firstWhere(
          (image) => image?['isPrimary'] == true,
          orElse: () => images.isEmpty ? null : images.first,
        );
    return HomeCompany(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      location: json['location']?.toString(),
      sector: json['sector']?.toString(),
      logoUrl: primaryImage?['url']?.toString(),
    );
  }
}

class HomeApplication {
  const HomeApplication({required this.id, required this.status, required this.statusLabel, required this.createdAt, this.jobTitle, this.companyName});

  final String id;
  final String status;
  final String statusLabel;
  final DateTime? createdAt;
  final String? jobTitle;
  final String? companyName;

  factory HomeApplication.fromJson(Map<String, dynamic> json) {
    final job = json['job'] as Map<String, dynamic>?;
    final company = job?['company'] as Map<String, dynamic>?;
    return HomeApplication(
      id: json['id']?.toString() ?? '',
      status: json['status']?.toString() ?? '',
      statusLabel: json['statusLabel']?.toString() ?? json['status']?.toString() ?? '',
      createdAt: DateTime.tryParse(json['createdAt']?.toString() ?? ''),
      jobTitle: job?['title']?.toString(),
      companyName: company?['name']?.toString(),
    );
  }
}

class HomeRepository {
  HomeRepository({ApiClient? api}) : _api = api ?? ApiClient();
  final ApiClient _api;

  Future<HomeDashboardData> load(String token) async {
    final results = await Future.wait([
      _api.get('/jobs'),
      _api.get('/companies'),
      _api.get('/applications/me', token: token),
    ]);
    final jobs = (results[0]['data'] as List<dynamic>? ?? const [])
        .whereType<Map<String, dynamic>>()
        .map(JobOffer.fromJson)
        .toList(growable: false);
    final companies = (results[1]['data'] as List<dynamic>? ?? const [])
        .whereType<Map<String, dynamic>>()
        .map(HomeCompany.fromJson)
        .where((company) => company.id.isNotEmpty && company.name.isNotEmpty)
        .toList(growable: false);
    final applications = (results[2]['data'] as List<dynamic>? ?? const [])
        .whereType<Map<String, dynamic>>()
        .map(HomeApplication.fromJson)
        .toList(growable: false);
    return HomeDashboardData(
      jobs: jobs, 
      companies: companies, 
      applications: applications,
      upcomingInterview: HomeInterview(
        companyName: 'TechCorp Solutions',
        jobTitle: 'Développeur Flutter Senior',
        date: DateTime.now().add(const Duration(days: 1, hours: 2)),
      ),
      profileCompletion: 80,
      profileViews: 14,
      unreadMessagesCount: 3,
      savedJobs: jobs.isNotEmpty && jobs.length > 1 ? [jobs[1]] : [],
      careerTips: const [
        HomeCareerTip(
          title: 'Réussir son entretien technique',
          description: 'Les 5 questions les plus fréquentes en entretien Flutter.',
          imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80',
        ),
        HomeCareerTip(
          title: 'Négocier son salaire',
          description: 'Comment aborder la question de la rémunération.',
          imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=600&q=80',
        ),
      ],
    );
  }
}
