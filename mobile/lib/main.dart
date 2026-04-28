import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'screens/onboarding_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'https://cgpmvpjwgormgkvrzsoc.supabase.co',
    anonKey: 'sb_publishable_LCOlHDduKVLLhzacgskePw_tgM7THX8',
  );

  runApp(const LingoFluxApp());
}

class LingoFluxApp extends StatelessWidget {
  const LingoFluxApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LingoFlux',
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        useMaterial3: true,
      ),
      home: const OnboardingScreen(),
    );
  }
}
