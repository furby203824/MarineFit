export const returnToRunData = {
    title: "Running Injury Prevention & Return to Run",
    source: "Department of Rehabilitation Services - Physical Therapy",
    intro: "The intent of these guidelines is to provide the athlete with a framework for return to sports activity following injury. These guidelines should not take the place of medical advice. If an athlete requires assistance, they should consult with their primary care physician, surgeon, or physical therapist.",

    sections: [
        {
            title: "Injury Prevention Tips",
            icon: "Shield",
            content: [
                "Gradual increases in running time / miles (10% rule)",
                "Be careful of excessive downhill running",
                "Reasonable amount of fast paced running",
                "Adequate rest between workouts",
                "Fewer hard surface runs",
                "Proper eating / sleeping",
                "Avoidance of complete fatigue",
                "Every run should have a purpose",
                "Develop stronger tissues – strength training"
            ]
        },
        {
            title: "Key Prevention Guidelines",
            icon: "AlertTriangle",
            content: [
                "80% of running injuries are caused by too much of an increase in mileage",
                "The cardiovascular system adjusts to stress quicker than the joints",
                "Joggers/runners should increase their total weekly running amount by no more than 10%",
                "Get a good pair of running sneakers and change them every 300-400 miles",
                "Run on soft, flat surfaces whenever possible. Treadmill training is fine",
                "If you cannot take more than a couple of days per week of impact, cross-train on bike or elliptical trainer",
                "Maintain or achieve ideal body weight to minimize joint stress",
                "Stretch regularly"
            ]
        },
        {
            title: "Warm Up & Cool Down",
            icon: "Thermometer",
            subsections: [
                {
                    subtitle: "Warm Up",
                    points: [
                        "Any cardio exercise should begin easy and gradually increase intensity",
                        "Should last 3-5 minutes",
                        "Example: If you normally run a 10-minute/mile pace, warm-up running 12-13 minute/mile pace or begin with walking briskly"
                    ]
                },
                {
                    subtitle: "Cool Down",
                    points: [
                        "At the end of the run, walk for around 3-5 minutes to prevent blood from pooling in your legs and to allow your heart rate to decrease"
                    ]
                },
                {
                    subtitle: "Stretching",
                    points: [
                        "Stretching should be done at the conclusion of the run",
                        "Stretch to the point of tension and hold for 20-30 seconds, at least 1x per muscle group",
                        "Do not bounce when stretching",
                        "If you have a particular tight spot, stretch more frequently (after the initial warm up or even at every mile)"
                    ]
                }
            ]
        },
        {
            title: "Warning Signs",
            icon: "Activity",
            subsections: [
                {
                    subtitle: "What pain is OK?",
                    type: "success",
                    points: [
                        "General muscle soreness",
                        "Slight joint discomfort after workout or next day that is gone in 24 hours",
                        "Slight stiffness at beginning of run or walk that dissipates after first 10 minutes"
                    ]
                },
                {
                    subtitle: "What pain is NOT OK? (Do not train!)",
                    type: "danger",
                    points: [
                        "Pain that is keeping you awake at night",
                        "Pain that is evident at beginning of run/walk then becomes worse as run/walk continues",
                        "Pain that changes your stride"
                    ]
                },
                {
                    subtitle: "Signs of Overtraining",
                    type: "warning",
                    points: [
                        "Difficulty performing typical workouts for more than a week",
                        "Excessive fatigue",
                        "Higher resting heart rate",
                        "Decreased appetite",
                        "Sorer muscles",
                        "Troubled sleep",
                        "Irritability",
                        "Increased perspiration",
                        "Decreased desire to train"
                    ]
                }
            ]
        },
        {
            title: "Injury Management",
            icon: "FirstAid",
            content: [
                "Ice area: 15-20 minutes several times per day (frozen peas work well)",
                "Elevate injured part while icing",
                "Rest (at least initially)",
                "Analyze program for possible causes (Mileage jump? Pace increase? Old shoes? Surface change?)",
                "Cross-train on non-impact cardio (elliptical trainer – 130+ strides/minute)",
                "Determine plan to return to full program, return to running very slowly",
                "Physical therapist and/or orthopedic referral"
            ]
        }
    ],

    phases: [
        {
            type: "walking",
            title: "Walking Program",
            description: "You should be able to walk, pain free, aggressively (roughly 4.2 to 5.2 miles per hour), in a controlled environment, preferably on a treadmill, before beginning the plyometric and walk/jog program.",
            guidelines: [
                "Walk pain-free at 4.2-5.2 mph before progressing.",
                "Use a treadmill for a controlled environment.",
                "Maintain proper posture and gait throughout."
            ],
            schedule: []
        },
        {
            type: "plyometric",
            title: "Plyometric Routine",
            description: "A mile run typically consists of 1500 foot contacts (750 per foot). This program integrates 470 foot contacts per leg (approx. 2/3 of a mile run). Successful completion indicates readiness for 0.5 - 0.75 mile run.",
            guidelines: [
                "Rest 90 seconds between sets, 3 minutes between exercises.",
                "Stretch Gastro, Soleus, Quads and Hamstrings between exercises.",
                "If you experience pain or unable to complete, stop, stretch and ice.",
                "If pain free next day, attempt to re-start."
            ],
            schedule: [
                { step: "Exercise 1", activity: "Two-leg ankle hops: in place", sets: 3, reps: 30, total: "90 contacts" },
                { step: "Exercise 2", activity: "Two-leg ankle hops: forward/backward", sets: 3, reps: 30, total: "90 contacts" },
                { step: "Exercise 3", activity: "Two-leg ankle hops: side to side", sets: 3, reps: 30, total: "90 contacts" },
                { step: "Exercise 4", activity: "One-leg ankle hops: in place", sets: 3, reps: 20, total: "60 contacts" },
                { step: "Exercise 5", activity: "One-leg ankle hops: forward/backward", sets: 3, reps: 20, total: "60 contacts" },
                { step: "Exercise 6", activity: "One-leg ankle hops: side to side", sets: 3, reps: 20, total: "60 contacts" },
                { step: "Exercise 7", activity: "One-leg broad hop", sets: 4, reps: 5, total: "20 contacts" }
            ],
            totalContacts: 470
        },
        {
            type: "interval",
            title: "Walk / Jog Progression",
            description: "Do not advance to the next step if you experience pain or soreness. Perform each step 2-3 times before advancing. Run on soft surfaces (track, trail) if possible.",
            guidelines: [
                "Perform each step 2-3 times before advancing.",
                "Run on soft surfaces (track, trail) if possible.",
                "Stop and consult a provider if pain increases during activity."
            ],
            schedule: [
                { step: "Step 1", activity: "Walk 4 min / Jog 1 min", reps: 4, total: "20 min" },
                { step: "Step 2", activity: "Walk 3 min / Jog 2 min", reps: 4, total: "20 min" },
                { step: "Step 3", activity: "Walk 2 min / Jog 3 min", reps: 4, total: "20 min" },
                { step: "Step 4", activity: "Walk 1 min / Jog 4 min", reps: 4, total: "20 min" },
                { step: "Step 5", activity: "Walk 1 min / Jog 4 min", reps: 6, total: "30 min" }
            ]
        },
        {
            type: "continuous",
            title: "Return to Continuous Running",
            description: "Begin with every other day running. Increase volume by no more than 10% per week.",
            guidelines: [
                "Run every other day to allow recovery.",
                "Increase total volume by no more than 10% per week.",
                "Return to previous step if pain returns."
            ],
            schedule: [
                { step: "Week 1", activity: "Run 20 min", reps: 1, total: "Every other day" },
                { step: "Week 2", activity: "Run 25 min", reps: 1, total: "Every other day" },
                { step: "Week 3", activity: "Run 30 min", reps: 1, total: "Every other day" },
                { step: "Week 4", activity: "Run 35 min", reps: 1, total: "Every other day" },
                { step: "Week 5", activity: "Run 40 min", reps: 1, total: "Every other day" }
            ]
        }
    ]
};
