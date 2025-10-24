<?php

namespace App\Helpers;

class GradeHelper
{
    // Convert percentage to grade (1.0 best, 5.0 worst)
    public static function percentageToGrade($percentage)
    {
        if ($percentage >= 100) return 1.0;
        elseif ($percentage >= 50) {
            return 1.0 + -0.04 * ($percentage - 100);
        } elseif ($percentage >= 0) {
            return 3.0 + -0.04 * ($percentage - 50);
        } else {
            return 5.0;
        }
    }

    public static function calculateFinalGrade($components)
    {
        // Constants
        $GRADE_COMPONENTS = [
            "ATTENDANCE" => "ATTENDANCE",
            "LABORATORY" => "LABORATORY",
            "ASSIGNMENT" => "ASSIGNMENT",
            "MIDTERM" => "MIDTERM",
        ];

        $WEIGHTS = [
            "MIXED_SCORE" => 0.7, // 70%
            "MIDTERM" => 0.3,     // 30%
        ];

        $MIXED_SCORE_WEIGHTS = [
            "ATTENDANCE" => 0.4, // 40% of mixed score
            "LABORATORY" => 0.4, // 40% of mixed score
            "ASSIGNMENT" => 0.2, // 20% of mixed score
        ];

        // Mixed score
        $mixedScore = 0;
        foreach ($components as $comp) {
            if (!array_key_exists($comp['componentType'], $MIXED_SCORE_WEIGHTS)) continue;

            $percentage = ($comp['total'] > 0)
                ? ($comp['earned'] / $comp['total']) * 100
                : 0;

            $grade = self::percentageToGrade($percentage);

            $mixedScore += $grade * $MIXED_SCORE_WEIGHTS[$comp['componentType']];
        }
        $mixedScore = $mixedScore * $WEIGHTS['MIXED_SCORE'];

        // Midterm
        $midterm = collect($components)->firstWhere('componentType', $GRADE_COMPONENTS['MIDTERM']);
        $midtermPercentage = ($midterm && $midterm['total'] > 0)
            ? ($midterm['earned'] / $midterm['total']) * 100
            : 0;

        $midtermGrade = self::percentageToGrade($midtermPercentage) * $WEIGHTS['MIDTERM'];

        // Final grade
        $finalGrade = round($mixedScore + $midtermGrade, 1);

        // Build detailed breakdown
        $componentResults = [];
        foreach ($components as $comp) {
            $percentage = ($comp['total'] > 0)
                ? ($comp['earned'] / $comp['total']) * 100
                : 0;

            $unweightedGrade = self::percentageToGrade($percentage);

            $weight = ($comp['componentType'] === $GRADE_COMPONENTS['MIDTERM'])
                ? $WEIGHTS['MIDTERM']
                : ($MIXED_SCORE_WEIGHTS[$comp['componentType']] ?? 0) * $WEIGHTS['MIXED_SCORE'];

            $componentResults[] = [
                "componentType" => $comp['componentType'],
                "earned" => $comp['earned'],
                "total" => $comp['total'],
                "percentage" => round($percentage, 1),
                "unweightedGrade" => round($unweightedGrade, 1),
                "weight" => $weight,
                "weightedGrade" => round($unweightedGrade * $weight, 1),
            ];
        }

        return [
            "finalGrade" => $finalGrade,
            "components" => $componentResults,
            "gradingScale" => "1.0–5.0 (1.0 highest, 5.0 lowest)",
        ];
    }
}
