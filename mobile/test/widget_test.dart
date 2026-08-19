import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:jobsinc_mobile/app/app.dart';

void main() {
  testWidgets('JOBSINC démarre correctement', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: JobsincApp(),
      ),
    );

    await tester.pump();

    expect(find.byType(JobsincApp), findsOneWidget);
  });
}
