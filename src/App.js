import { useState, useEffect } from "react";

// ─── ARCHITECTURE DATA ────────────────────────────────────────────────────────

const ARCH = [
  {
    id: "sources",
    layer: "01",
    title: "DATA SOURCES",
    icon: "◈",
    color: "#00d4aa",
    tag: "UPDATED",
    tagColor: "#00d4aa",
    summary:
      "18 live data sources. Now includes Asian Handicap odds, Over/Under market odds, and multi-bookmaker consensus feeds alongside all existing sources.",
    fixes: [
      "Added API-Football Fixtures endpoint as master calendar source",
      "UTC-only timestamp enforcement across all sources",
      "Competition hierarchy metadata from each source",
      "Added Asian Handicap source — sharpest market signal in football betting",
      "Added Over/Under odds source — market-validated goal expectation prior",
      "Added multi-bookmaker consensus for 1X2, AH, and O/U markets",
    ],
    nodes: [
      {
        label: "Match Results",
        detail: "football-data.co.uk — 20+ leagues, 20+ years history",
        icon: "⚽",
      },
      {
        label: "xG & Adv Stats",
        detail: "FBRef + Understat — scraped daily post-match",
        icon: "📊",
      },
      {
        label: "Player Stats",
        detail: "FBRef — player-level, updated weekly",
        icon: "👤",
      },
      {
        label: "1X2 Odds (European)",
        detail: "The Odds API — $5/mo, opening + closing, 3+ bookmakers",
        icon: "📈",
      },
      {
        label: "Asian Handicap Odds",
        detail: "API-Football + The Odds API — AH line, open/close, movement",
        icon: "🎯",
        isNew: true,
      },
      {
        label: "Over/Under Odds",
        detail: "The Odds API — 1.5/2.5/3.5 lines, opening + closing",
        icon: "⚖",
        isNew: true,
      },
      {
        label: "Multi-Book Consensus",
        detail: "Bet365, Pinnacle, SBOBet, Mansion88 — consensus implied prob",
        icon: "🏦",
        isNew: true,
      },
      {
        label: "Injuries & Susp.",
        detail: "API-Football — daily updates",
        icon: "🏥",
      },
      {
        label: "Confirmed Lineups",
        detail: "API-Football — T-75min polling starts",
        icon: "📋",
      },
      {
        label: "Weather Forecasts",
        detail: "Open-Meteo — free, hourly, by GPS venue",
        icon: "🌦",
      },
      {
        label: "Referee Stats",
        detail: "FBRef scrape — cards, pens, strictness index",
        icon: "🟨",
      },
      {
        label: "Travel Distance",
        detail: "Haversine from GPS coords per team per match",
        icon: "✈",
      },
      {
        label: "Squad Values",
        detail: "Transfermarkt — bi-annual scrape",
        icon: "💶",
      },
      {
        label: "H2H History",
        detail: "Derived from match results DB",
        icon: "⚔",
      },
      {
        label: "Venue Profile",
        detail: "Static DB — pitch dims, surface, altitude",
        icon: "🏟",
      },
      {
        label: "Intl Duty Data",
        detail: "API-Football — per international window",
        icon: "🌍",
      },
      {
        label: "Manager Profile",
        detail: "FBRef — PPDA, pressing index",
        icon: "🧠",
      },
      {
        label: "Fixture Calendar",
        detail: "API-Football — full schedule, UTC kickoffs",
        icon: "📅",
        isNew: true,
      },
      {
        label: "Competition Schedule",
        detail: "API-Football — cup draws, CL/EL group stages",
        icon: "🏆",
        isNew: true,
      },
    ],
  },

  {
    id: "fixture",
    layer: "02",
    title: "FIXTURE INTELLIGENCE ENGINE",
    icon: "📅",
    color: "#06b6d4",
    tag: "NEW LAYER",
    tagColor: "#06b6d4",
    summary:
      "Brand new layer. The master clock of the entire system. All pipeline activity is driven by this layer — nothing runs on fixed time intervals, everything reacts to fixture events.",
    fixes: [
      "Entire layer is new — previously the system had no calendar awareness",
      "Fixes: missed predictions for early kickoffs, wrong kickoff times after DST change, no postponement detection, no competition context",
    ],
    nodes: [
      {
        label: "Weekly Fixture Sync",
        detail:
          "Every Sunday 06:00 UTC — pulls 14-day schedule for all leagues",
        icon: "🔄",
        isNew: true,
      },
      {
        label: "UTC Enforcement",
        detail: "All kickoffs stored in UTC only. DST handled at display layer",
        icon: "🕐",
        isNew: true,
      },
      {
        label: "League Profile Store",
        detail:
          "Season start/end, winter break windows, typical matchday patterns",
        icon: "📋",
        isNew: true,
      },
      {
        label: "Competition Hierarchy",
        detail:
          "League > Cup > European — motivation + rotation likelihood weights",
        icon: "🏆",
        isNew: true,
      },
      {
        label: "Postponement Watcher",
        detail:
          "Polls fixture status every 4h. Detects postponed/cancelled/suspended",
        icon: "👁",
        isNew: true,
      },
      {
        label: "Reschedule Detector",
        detail:
          "Flags matches that reappear with new dates — marks as rescheduled",
        icon: "🔁",
        isNew: true,
      },
      {
        label: "International Break Cal",
        detail:
          "Marks all FIFA/UEFA break windows per season per confederation",
        icon: "🌍",
        isNew: true,
      },
      {
        label: "Kickoff Slot Classifier",
        detail:
          "12:30 / 15:00 / 17:30 / 20:00 slots — encodes broadcast + rest context",
        icon: "⏰",
        isNew: true,
      },
      {
        label: "Per-Match Deadline Calc",
        detail: "deadline = kickoff_utc - 60min. Individual deadline per match",
        icon: "⏱",
        isNew: true,
      },
      {
        label: "Priority Queue Builder",
        detail:
          "Orders all upcoming tasks by deadline ASC — nearest deadline first",
        icon: "📊",
        isNew: true,
      },
      {
        label: "Congestion Detector",
        detail:
          "Flags teams with 3+ matches in 7 days or 5+ matches in 14 days",
        icon: "🚨",
        isNew: true,
      },
      {
        label: "Same-Day Sequence Map",
        detail:
          "Identifies early/late kickoff pairs on same day for Elo gating",
        icon: "🗺",
        isNew: true,
      },
    ],
  },

  {
    id: "ingestion",
    layer: "03",
    title: "DATA INGESTION PIPELINE",
    icon: "⬇",
    color: "#4dabf7",
    tag: "v3.2 UPGRADED",
    tagColor: "#0D9488",
    summary:
      "Event-driven, parallel, and now with continuous multi-snapshot odds polling. Catches sharp money movement timing — not just direction.",
    fixes: [
      "Now spawns parallel ingestion workers per match — not sequential",
      "Competition context attached to every ingested row",
      "UTC timestamp on every record — no local time anywhere in the DB",
      "v3.2: Continuous odds polling at T-24h, T-12h, T-6h, T-2h, T-60min — captures sharp money waves",
      "v3.2: Sharp money window snapshot at T-2h — the most informative timing for professional money flow",
      "v3.2: Multi-snapshot variance tracking — detects market line stability vs volatility",
    ],
    nodes: [
      {
        label: "Parallel API Collectors",
        detail:
          "One async worker per match — 20 matches = 20 concurrent collectors",
        icon: "⬇",
        isNew: true,
      },
      {
        label: "Continuous Odds Polling",
        detail:
          "v3.2: T-24h, T-12h, T-6h, T-2h, T-60min snapshots — 5 timepoints",
        icon: "📡",
        isNew: true,
      },
      {
        label: "Sharp Money Window Capture",
        detail:
          "v3.2: Dedicated T-2h snapshot when professional money typically enters",
        icon: "💰",
        isNew: true,
      },
      {
        label: "Snapshot Variance Tracker",
        detail:
          "v3.2: Computes line stability across 5 snapshots — detects volatility",
        icon: "📊",
        isNew: true,
      },
      {
        label: "Retry + Circuit Breaker",
        detail: "Tenacity lib — exp. backoff 1s→2s→4s→8s, opens after 5 fails",
        icon: "🔄",
      },
      {
        label: "Schema Validation",
        detail: "Pydantic v2 — strict types, UTC datetime enforcement",
        icon: "✅",
      },
      {
        label: "Deduplication",
        detail: "SHA-256 hash of (match_id, source, snapshot_utc) — idempotent",
        icon: "🔲",
      },
      {
        label: "Competition Context Tag",
        detail: "Every row tagged: league / cup / european / friendly",
        icon: "🏷",
        isNew: true,
      },
      {
        label: "Data Cleaning",
        detail: "Null impute, outlier clip at 3-sigma, type normalisation",
        icon: "🧹",
      },
      {
        label: "Missing Value Handler",
        detail: "Median/forward-fill + binary flag column per imputed field",
        icon: "⬜",
      },
      {
        label: "RobustScaler",
        detail: "IQR-based normalisation — outlier resistant, scaler persisted",
        icon: "📐",
      },
      {
        label: "Per-Match SLA Monitor",
        detail:
          "Alert if any match data missing beyond its individual deadline",
        icon: "⏱",
        isNew: true,
      },
      {
        label: "PgBouncer Connection Pool",
        detail:
          "Multiplexes workers through 20 real DB connections — prevents overload",
        icon: "🔗",
        isNew: true,
      },
      {
        label: "Dataset Versioning",
        detail: "DVC — full dataset lineage with match_id and ingestion_utc",
        icon: "📦",
      },
    ],
  },

  {
    id: "statemachine",
    layer: "04",
    title: "MATCH STATE MACHINE",
    icon: "⚙",
    color: "#8b5cf6",
    tag: "NEW LAYER",
    tagColor: "#8b5cf6",
    summary:
      "Every match is a living process with defined states. The entire pipeline is event-driven from these state transitions — nothing is scheduled on fixed clocks. This is what makes the system production-grade.",
    fixes: [
      "Previously: pipeline ran on fixed time triggers — caused missed predictions, duplicate runs, no recovery path",
      "Now: every match has a defined state. Stuck states are detected and alerted. Failures have clear recovery paths",
    ],
    nodes: [
      {
        label: "SCHEDULED",
        detail: "Match exists in fixture table. Pipeline not yet started",
        icon: "📅",
        isNew: true,
      },
      {
        label: "DATA_COLLECTION",
        detail:
          "T-24h trigger. Pulls form, xG, Elo, odds, H2H, weather, referee",
        icon: "📥",
        isNew: true,
      },
      {
        label: "FEATURES_COMPUTED",
        detail: "All pre-lineup features written to team_features table",
        icon: "✅",
        isNew: true,
      },
      {
        label: "LINEUP_PENDING",
        detail:
          "T-90min. Polls API every 5min. Match waits here until both confirmed",
        icon: "⏳",
        isNew: true,
      },
      {
        label: "LINEUP_CONFIRMED",
        detail:
          "Both squads confirmed. Player impact + injury scores recalculated",
        icon: "📋",
        isNew: true,
      },
      {
        label: "PREDICTION_RUNNING",
        detail:
          "All 8 base models running. Ensemble stacking. Monte Carlo simulation",
        icon: "⚡",
        isNew: true,
      },
      {
        label: "PREDICTION_CACHED",
        detail:
          "Full output in Redis. API serves instantly. Invalidate on event",
        icon: "💾",
        isNew: true,
      },
      {
        label: "LIVE",
        detail:
          "Kickoff passed. No new predictions generated (Phase 1). Phase 2: live update",
        icon: "🟢",
        isNew: true,
      },
      {
        label: "COMPLETED",
        detail: "Result ingested. Triggers post-match pipeline automatically",
        icon: "✔",
        isNew: true,
      },
      {
        label: "FEATURES_UPDATED",
        detail:
          "Elo updated. Rolling features refreshed. CLV computed. DVC versioned",
        icon: "🔄",
        isNew: true,
      },
      {
        label: "RETRAIN_TRIGGERED",
        detail: "Champion/challenger job fired after matchday completion",
        icon: "🤖",
        isNew: true,
      },
      {
        label: "ARCHIVED",
        detail: "Full historical record stored. Audit trail complete",
        icon: "📦",
        isNew: true,
      },
      {
        label: "State Transition Log",
        detail: "Every state change recorded with timestamp + trigger source",
        icon: "📋",
        isNew: true,
      },
      {
        label: "Stuck State Detector",
        detail: "Alert if any match stays in same state > threshold time",
        icon: "🚨",
        isNew: true,
      },
    ],
  },

  {
    id: "features",
    layer: "05",
    title: "FEATURE ENGINEERING",
    icon: "⚗",
    color: "#f59e0b",
    tag: "MAJOR UPDATE",
    tagColor: "#f59e0b",
    summary:
      "Now 34 features. 8 new odds market features added — Asian Handicap line, AH implied probability, AH movement, Over/Under opening/closing/movement, multi-bookmaker consensus, and sharp money divergence signal.",
    fixes: [
      "Rest feature was day-level — now hour-precision from final whistle to kickoff",
      "Form features had no staleness flag across international breaks",
      "No Elo freshness gate — stale Elo from before same-day early kickoffs used in later predictions",
      "No competition rotation likelihood — cup vs league treated identically",
      "NEW: Asian Handicap line encodes expected goal margin — sharpest market signal available",
      "NEW: O/U closing odds give market-validated prior for Poisson lambda — improves simulation accuracy",
      "NEW: Multi-bookmaker consensus detects where all books agree vs where they diverge",
    ],
    nodes: [
      {
        label: "Elo Rating",
        detail: "Time-decayed, home/away split, atomic DB transaction updates",
        icon: "📊",
      },
      {
        label: "Elo Freshness Gate",
        detail:
          "Only uses Elo with valid_from < prediction_run_utc — no stale Elo",
        icon: "🔒",
        isNew: true,
      },
      {
        label: "Same-Day Elo Sequencing",
        detail:
          "Early kickoff Elo updates available to later same-day predictions",
        icon: "🗺",
        isNew: true,
      },
      {
        label: "xG Attack/Defence",
        detail: "Rolling 5 & 10 game windows — competition-weighted",
        icon: "⚡",
      },
      {
        label: "Player Impact Model",
        detail: "Confirmed lineup xG sum + absence penalty per missing player",
        icon: "👤",
      },
      {
        label: "Injury Impact Score",
        detail: "Severity-weighted missing player xG contribution sum",
        icon: "🏥",
      },
      {
        label: "1X2 Implied Probability",
        detail:
          "Opening + closing European odds converted to implied prob — 3 books",
        icon: "📈",
      },
      {
        label: "1X2 Odds Movement",
        detail: "Opening to closing delta — sharp money signal on 1X2 market",
        icon: "📉",
      },
      {
        label: "Asian Handicap Line",
        detail:
          "AH handicap number encodes expected goal margin — sharpest signal",
        icon: "🎯",
        isNew: true,
      },
      {
        label: "AH Implied Probability",
        detail: "AH odds → implied home/away win prob — eliminates draw noise",
        icon: "🎯",
        isNew: true,
      },
      {
        label: "AH Movement Signal",
        detail:
          "AH line shift from open to close — Pinnacle/SBOBet sharp money",
        icon: "🎯",
        isNew: true,
      },
      {
        label: "O/U Opening Odds",
        detail: "Market prior on total goals — 1.5/2.5/3.5 lines at open",
        icon: "⚖",
        isNew: true,
      },
      {
        label: "O/U Closing Odds",
        detail:
          "Closing O/U odds as Poisson lambda prior — most accurate signal",
        icon: "⚖",
        isNew: true,
      },
      {
        label: "O/U Movement Signal",
        detail: "O/U line shift open→close — sharp money view on total goals",
        icon: "⚖",
        isNew: true,
      },
      {
        label: "Multi-Book Consensus",
        detail:
          "Variance across Bet365/Pinnacle/Mansion88 — high variance = uncertainty",
        icon: "🏦",
        isNew: true,
      },
      {
        label: "Sharp Money Divergence",
        detail:
          "Model prob vs AH implied prob delta — flags where model disagrees with sharpest market",
        icon: "💡",
        isNew: true,
      },
      {
        label: "Hour-Precision Rest",
        detail: "Exact hours from last final whistle to this kickoff UTC",
        icon: "⏱",
        isNew: true,
      },
      {
        label: "Congestion Score",
        detail:
          "Matches in prev 7/14/21 days + scheduled next 14 days per team",
        icon: "📅",
        isNew: true,
      },
      {
        label: "Competition Context Wt.",
        detail: "League=1.0, CL KO=1.0, CL Group=0.85, Cup early=0.6 weight",
        icon: "🏆",
        isNew: true,
      },
      {
        label: "Rotation Likelihood",
        detail:
          "Predicted rotation prob based on competition + congestion context",
        icon: "🔄",
        isNew: true,
      },
      {
        label: "Form Staleness Flag",
        detail:
          "Reduces form feature weight when gap spans international break",
        icon: "📉",
        isNew: true,
      },
      {
        label: "Kickoff Slot Feature",
        detail: "12:30/15:00/17:30/20:00 — encodes rest differential context",
        icon: "⏰",
        isNew: true,
      },
      {
        label: "Rest Hour Differential",
        detail: "Home rest hours minus away rest hours — asymmetric recovery",
        icon: "⚖",
      },
      {
        label: "Home Advantage",
        detail: "Team-specific, Elo-adjusted — varies 2-8% across teams",
        icon: "🏠",
      },
      {
        label: "Travel Fatigue",
        detail: "Haversine km + timezone crossings — hour-precision from match",
        icon: "✈",
      },
      {
        label: "Referee Profile",
        detail: "Cards/game, pen rate, home bias index, strictness composite",
        icon: "🟨",
      },
      {
        label: "Weather Impact",
        detail: "Wind x Rain interaction — computed 3h before kickoff",
        icon: "🌦",
      },
      {
        label: "Time-Decay Form",
        detail: "Exponential decay λ=0.05 per matchday — recency weighted",
        icon: "📉",
      },
      {
        label: "H2H Features",
        detail: "Win rate, avg goals, goal diff — last 10 H2H encounters",
        icon: "⚔",
      },
      {
        label: "CLV Tracker",
        detail: "Your predicted prob vs bookmaker closing implied prob delta",
        icon: "🎯",
      },
      {
        label: "Table Momentum",
        detail: "League position change last 5 gameweeks",
        icon: "📐",
      },
      {
        label: "Intl Break Fatigue",
        detail: "Intl matches played + long-haul travel flag per player",
        icon: "🌍",
      },
      {
        label: "Venue Characteristics",
        detail: "Pitch dimensions, surface type, altitude in metres",
        icon: "🏟",
      },
      {
        label: "Manager Press Profile",
        detail: "PPDA index — high-press style affects fatigue differently",
        icon: "🧠",
      },
      {
        label: "Squad Value Index",
        detail: "Transfermarkt market value — quality proxy, normalised",
        icon: "💶",
      },
    ],
  },

  {
    id: "models",
    layer: "06",
    title: "BASE MODEL LAYER",
    icon: "◉",
    color: "#a78bfa",
    tag: "STABLE",
    tagColor: "#16A34A",
    summary:
      "8 base models covering different algorithmic families. Stable from v2. Competition context now passed as a feature to all models.",
    fixes: [
      "Competition context feature now fed to all models",
      "Rotation likelihood feature added — models learn cup squad patterns",
    ],
    nodes: [
      {
        label: "XGBoost",
        detail: "Primary model — DART mode, competition context aware",
        icon: "🌲",
      },
      {
        label: "LightGBM",
        detail: "Speed + scale — leaf-wise growth, best on rolling features",
        icon: "⚡",
      },
      {
        label: "CatBoost",
        detail: "Native categoricals — referee_id, league_id, venue_surface",
        icon: "🐱",
      },
      {
        label: "Random Forest",
        detail: "500 trees — OOB estimates, diversity source for ensemble",
        icon: "🌳",
      },
      {
        label: "Poisson + DC",
        detail: "Dixon-Coles rho correction — 0-0/1-0/0-1/1-1 bias fixed",
        icon: "📐",
      },
      {
        label: "Bayesian Poisson",
        detail: "Uncertainty bounds on lambda_h and lambda_a",
        icon: "📊",
      },
      {
        label: "Elo Model",
        detail: "Strength prior — always uses freshness-gated Elo",
        icon: "📈",
      },
      {
        label: "Logistic Reg.",
        detail:
          "Sanity baseline — if ensemble loses to this, something is wrong",
        icon: "📏",
      },
    ],
  },

  {
    id: "ensemble",
    layer: "07",
    title: "ENSEMBLE + CALIBRATION",
    icon: "⊕",
    color: "#f472b6",
    tag: "STABLE",
    tagColor: "#16A34A",
    summary:
      "Stacking ensemble with full calibration stack. Stable from v2. Competition context weighting applied at blend stage.",
    fixes: [
      "Competition context used to adjust ensemble weights — cup predictions rely less on form, more on Elo",
    ],
    nodes: [
      {
        label: "OOF Stacking",
        detail: "Out-of-fold — TimeSeriesSplit enforced at all levels",
        icon: "🗂",
      },
      {
        label: "Weighted Blend",
        detail: "Weights proportional to rolling 30d validation log loss",
        icon: "⚖",
      },
      {
        label: "Competition Adj. Blend",
        detail: "Cup early rounds down-weight form, up-weight Elo",
        icon: "🏆",
        isNew: true,
      },
      {
        label: "Geometric Prob Merge",
        detail: "Geometric mean outperforms arithmetic for calibrated models",
        icon: "∑",
      },
      {
        label: "Platt Scaling",
        detail: "Binary output calibration per class",
        icon: "📐",
      },
      {
        label: "Isotonic Regression",
        detail: "3-class calibration — monotonic, non-parametric",
        icon: "〰",
      },
      {
        label: "Temperature Scaling",
        detail: "Learned T scalar — corrects over/under-confidence",
        icon: "🌡",
      },
      {
        label: "Calibration Curves",
        detail: "Reliability diagrams — per class, per league, per competition",
        icon: "📊",
      },
    ],
  },

  {
    id: "simulation",
    layer: "08",
    title: "MATCH SIMULATION",
    icon: "⟳",
    color: "#34d399",
    tag: "STABLE",
    tagColor: "#16A34A",
    summary:
      "Monte Carlo simulation with Dixon-Coles correction. Stable from v2.",
    fixes: [],
    nodes: [
      {
        label: "Poisson Goal Dist.",
        detail: "lambda_h and lambda_a from ensemble xG outputs",
        icon: "📐",
      },
      {
        label: "Dixon-Coles Fix",
        detail: "Rho param — corrects 0-0/1-0/0-1/1-1 underestimation",
        icon: "🔧",
      },
      {
        label: "Correlated Goals Adj.",
        detail: "Bivariate Poisson — tau correlation between scorelines",
        icon: "🔗",
      },
      {
        label: "Monte Carlo 10K",
        detail: "10,000 iterations — stable probability surface",
        icon: "🎲",
      },
      {
        label: "Scoreline Grid",
        detail: "P(i,j) for all goals i,j in [0..8]",
        icon: "⊞",
      },
      {
        label: "Margin Aggregation",
        detail: "Sum triangles → W/D/L probability from scoreline grid",
        icon: "△",
      },
    ],
  },

  {
    id: "output",
    layer: "09",
    title: "PREDICTION OUTPUT",
    icon: "▶",
    color: "#60a5fa",
    tag: "v3.2 UPGRADED",
    tagColor: "#0D9488",
    summary:
      "Now 21 technical outputs. v3.2 adds risk_level field, stability_score, market_sanity_check, and no_bet_reason — feeds the new Pick Translation layer downstream.",
    fixes: [
      "Output now includes form_staleness_flag — warns consumer if prediction uses stale post-break form",
      "Competition context label added to every prediction payload",
      "SHAP now surfaces time-based and odds-based features when they are top drivers",
      "Asian Handicap recommendation — model's view vs market AH line",
      "O/U value flag — where model total goals estimate diverges from O/U closing line",
      "Sharp money alert — when AH movement contradicts model prediction",
      "v3.2: risk_level field (LOW/MEDIUM/HIGH) — quantifies prediction reliability",
      "v3.2: stability_score — tracks how stable odds were across 5 polling snapshots",
      "v3.2: market_sanity_check — auto-fail flag when prediction wildly diverges from sharp money",
      "v3.2: no_bet_reason — when system recommends NO BET, explains why",
    ],
    nodes: [
      {
        label: "Win/Draw/Loss Probs",
        detail: "Calibrated, sum to 1.0, validated before serving",
        icon: "🏆",
      },
      {
        label: "Expected Goals",
        detail: "Lambda h/a with 90% CI from Bayesian Poisson",
        icon: "⚽",
      },
      {
        label: "Most Likely Score",
        detail: "Mode of 10K Monte Carlo runs",
        icon: "🔢",
      },
      {
        label: "Over/Under Probs",
        detail: "1.5 / 2.5 / 3.5 goal lines from scoreline grid",
        icon: "📊",
      },
      {
        label: "O/U Value Flag",
        detail: "Where model xG diverges from O/U closing line by >0.3 goals",
        icon: "⚖",
        isNew: true,
      },
      {
        label: "BTTS Probability",
        detail: "P(h>=1) x P(a>=1) — marginal product",
        icon: "🥅",
      },
      {
        label: "Asian Handicap Rec.",
        detail: "Model's implied AH line vs market AH line — agree or diverge",
        icon: "🎯",
        isNew: true,
      },
      {
        label: "AH Value Detection",
        detail: "Flags AH bets where model prob > AH implied prob by >3%",
        icon: "💰",
        isNew: true,
      },
      {
        label: "Multi-Book Consensus",
        detail: "Bet365/Pinnacle/Mansion88 implied prob range in every payload",
        icon: "🏦",
        isNew: true,
      },
      {
        label: "Sharp Money Alert",
        detail: "Flags when AH line moved against our prediction — reassess",
        icon: "🚨",
        isNew: true,
      },
      {
        label: "1X2 Value Bet",
        detail: "Edge = model_prob - market_norm_prob. Flag if >3%",
        icon: "💰",
      },
      {
        label: "Confidence Score",
        detail: "1 - entropy(W/D/L probs) — [0,1]",
        icon: "🎯",
      },
      {
        label: "Risk Level",
        detail: "v3.2: LOW/MEDIUM/HIGH — composite of confidence + stability",
        icon: "🚦",
        isNew: true,
      },
      {
        label: "Stability Score",
        detail:
          "v3.2: Variance across 5 odds snapshots — stable lines = trustworthy",
        icon: "📊",
        isNew: true,
      },
      {
        label: "Market Sanity Check",
        detail:
          "v3.2: PASS/FAIL — fails if prediction wildly diverges from sharp money",
        icon: "🔍",
        isNew: true,
      },
      {
        label: "No-Bet Reason",
        detail: "v3.2: When recommended pick = NO BET, explains why",
        icon: "🚫",
        isNew: true,
      },
      {
        label: "SHAP Explanation",
        detail: "Top 3 features per prediction — includes odds + time features",
        icon: "💡",
      },
      {
        label: "Form Staleness Flag",
        detail: "Warns if prediction uses post-break stale form data",
        icon: "⚠",
        isNew: true,
      },
      {
        label: "Competition Label",
        detail: "League / Cup / CL-Group / CL-KO in every payload",
        icon: "🏆",
        isNew: true,
      },
      {
        label: "Rest Differential",
        detail: "Home hours rest minus away hours rest — in output",
        icon: "⏱",
        isNew: true,
      },
      {
        label: "Rotation Likelihood",
        detail: "Predicted probability manager rotates squad today",
        icon: "🔄",
        isNew: true,
      },
    ],
  },

  {
    id: "picks",
    layer: "09b",
    title: "PICK TRANSLATION LAYER",
    icon: "🎯",
    color: "#10B981",
    tag: "v3.2 NEW LAYER",
    tagColor: "#10B981",
    summary:
      "Brand new layer in v3.2. Translates technical probability outputs into clear actionable user-facing picks. This is the layer that turns 'Home Win 58%' into 'BET HOME -0.5'.",
    fixes: [
      "Entire layer is new in v3.2 — addresses boss requirement: 'Tell the user exactly what to bet on'",
      "Maps probabilities + value edges + sharp money signals to a single recommended pick",
      "Categorises picks by user-friendly tiers: HIGH / MEDIUM / LOW confidence",
      "Includes NO BET as a valid output — system refuses to recommend when no clear edge exists",
      "Provides plain-language reasoning for every pick — builds user trust",
    ],
    nodes: [
      {
        label: "Pick Decision Engine",
        detail:
          "Multi-criteria logic: prob threshold + edge + confidence + sanity check",
        icon: "⚙",
        isNew: true,
      },
      {
        label: "Direct Outcome Picks",
        detail:
          "HOME WIN / DRAW / AWAY WIN — when max prob >0.60 AND confidence >0.75",
        icon: "🏆",
        isNew: true,
      },
      {
        label: "Asian Handicap Picks",
        detail: "e.g. 'HOME -0.5' or 'AWAY +1.0' — when AH value edge >4%",
        icon: "⚖",
        isNew: true,
      },
      {
        label: "Over/Under Picks",
        detail: "e.g. 'OVER 2.5' — when xG total diverges from market by >0.3",
        icon: "⚽",
        isNew: true,
      },
      {
        label: "Correct Score Picks",
        detail: "e.g. '2-1' — when most likely scoreline has >12% probability",
        icon: "🔢",
        isNew: true,
      },
      {
        label: "BTTS Picks",
        detail: "BTTS YES/NO when value edge >4% on this market",
        icon: "🥅",
        isNew: true,
      },
      {
        label: "Confidence Tier Mapper",
        detail:
          "HIGH (≥0.75) / MEDIUM (0.55-0.74) / LOW (<0.55) — user-facing tiers",
        icon: "🎯",
        isNew: true,
      },
      {
        label: "Bet Strength Score",
        detail: "1-10 scale — composite of confidence + edge + stability",
        icon: "⭐",
        isNew: true,
      },
      {
        label: "NO BET Filter",
        detail:
          "Refuses to recommend when no clear edge — preserves user trust",
        icon: "🚫",
        isNew: true,
      },
      {
        label: "Plain-Language Reasoning",
        detail:
          "e.g. 'Strong xG difference + favorable rest gap + sharp money aligned'",
        icon: "💬",
        isNew: true,
      },
      {
        label: "Alternative Picks",
        detail: "Secondary recommendations across other markets for same match",
        icon: "📋",
        isNew: true,
      },
      {
        label: "Pick Stability Filter",
        detail:
          "Suppresses picks where odds movement was too volatile to trust",
        icon: "🛡",
        isNew: true,
      },
    ],
  },

  {
    id: "evaluation",
    layer: "10",
    title: "MODEL EVALUATION",
    icon: "◎",
    color: "#fb923c",
    tag: "UPDATED",
    tagColor: "#fb923c",
    summary:
      "Evaluation now covers all three markets — 1X2, Asian Handicap, and Over/Under. Tracks accuracy per market type, per competition, per kickoff slot, and per congestion level.",
    fixes: [
      "Now evaluates separately by competition type — cup predictions tracked vs league predictions",
      "Kickoff slot analysis — does 12:30 slot degrade accuracy?",
      "Congestion band analysis — do high-fatigue predictions underperform?",
      "NEW: Asian Handicap accuracy tracked separately from 1X2",
      "NEW: O/U model accuracy vs O/U closing line — is our xG estimate beating the market?",
      "NEW: Sharp money alignment rate — when AH moved against us, were we right or wrong?",
    ],
    nodes: [
      {
        label: "Log Loss",
        detail: "Primary metric — minimize. Target < 0.95",
        icon: "📉",
      },
      {
        label: "Brier Score",
        detail: "Per-class probability MSE. Target < 0.22",
        icon: "📊",
      },
      { label: "ROC-AUC", detail: "One-vs-rest per class", icon: "📈" },
      {
        label: "Calibration Curve",
        detail: "Reliability diagram — per class, per league, per market",
        icon: "〰",
      },
      {
        label: "RPS",
        detail: "Ranked Probability Score — industry standard",
        icon: "🏅",
      },
      {
        label: "1X2 vs Closing Line",
        detail: "Your 1X2 log loss vs bookmaker closing line log loss",
        icon: "⚖",
      },
      {
        label: "AH Accuracy",
        detail: "AH recommendation correct rate vs actual goal margin",
        icon: "🎯",
        isNew: true,
      },
      {
        label: "AH vs Market CLV",
        detail: "AH predicted prob vs AH closing implied prob — CLV on AH",
        icon: "💰",
        isNew: true,
      },
      {
        label: "O/U Model Accuracy",
        detail: "Model xG total vs O/U closing line — is our lambda better?",
        icon: "⚖",
        isNew: true,
      },
      {
        label: "Sharp Money Alignment",
        detail: "When AH moved against us, outcome analysis — right or wrong",
        icon: "🚨",
        isNew: true,
      },
      {
        label: "Per-League Breakdown",
        detail: "EPL, Bundesliga, Serie A, La Liga separate",
        icon: "🌍",
      },
      {
        label: "Per-Competition",
        detail: "League vs Cup vs European — separate accuracy tracks",
        icon: "🏆",
        isNew: true,
      },
      {
        label: "Congestion Band Eval",
        detail: "Accuracy for 3+ matches in 7 days vs normal rest",
        icon: "📅",
        isNew: true,
      },
      {
        label: "Kickoff Slot Eval",
        detail: "12:30 vs 15:00 vs 17:30 vs 20:00 — slot accuracy",
        icon: "⏰",
        isNew: true,
      },
      {
        label: "Post-Break Accuracy",
        detail: "Tracks if form staleness flag correctly lowers confidence",
        icon: "📉",
        isNew: true,
      },
      {
        label: "ROI Backtest",
        detail:
          "Kelly sizing across all 3 markets — 500+ bets for significance",
        icon: "💹",
      },
      {
        label: "CLV Tracking",
        detail: "Positive CLV over 200+ predictions per market = genuine edge",
        icon: "🎯",
      },
    ],
  },

  {
    id: "monitoring",
    layer: "11",
    title: "MONITORING & ALERTING",
    icon: "👁",
    color: "#e879f9",
    tag: "MAJOR UPDATE",
    tagColor: "#e879f9",
    summary:
      "Monitoring now covers the entire state machine lifecycle, per-match SLAs, postponement detection, and fixture calendar health — not just model metrics.",
    fixes: [
      "Per-match SLA monitoring — each match has its own deadline, not a global one",
      "Postponement detector now integrated into monitoring loop",
      "State machine health monitor — stuck matches detected and alerted",
      "Fixture calendar freshness tracked — alerts if sync is overdue",
    ],
    nodes: [
      {
        label: "Model Drift",
        detail: "Rolling 20-match log loss vs 90-day baseline. Alert >10%",
        icon: "📉",
      },
      {
        label: "Per-Match SLA",
        detail: "Each match has individual deadline. Alert if prediction late",
        icon: "⏱",
        isNew: true,
      },
      {
        label: "State Machine Monitor",
        detail: "Alert if any match stuck in same state > threshold",
        icon: "⚙",
        isNew: true,
      },
      {
        label: "Postponement Detector",
        detail: "Polls fixture status every 4h. Cancels pipeline on detect",
        icon: "🚨",
        isNew: true,
      },
      {
        label: "Reschedule Tracker",
        detail: "Flags rescheduled matches — updates congestion features",
        icon: "🔁",
        isNew: true,
      },
      {
        label: "Fixture Calendar Health",
        detail: "Alert if weekly sync is >6h overdue or returns 0 fixtures",
        icon: "📅",
        isNew: true,
      },
      {
        label: "Same-Day Sequence Alert",
        detail: "Warns if early kickoff Elo hasn't updated before late match",
        icon: "🗺",
        isNew: true,
      },
      {
        label: "PSI Feature Drift",
        detail: "Population Stability Index per feature — retrain if >0.2",
        icon: "📐",
      },
      {
        label: "Concept Drift",
        detail: "Feature-to-outcome relationship stability tracking",
        icon: "🌊",
      },
      {
        label: "Worker Pool Health",
        detail: "Queue depth, worker utilisation, task completion rates",
        icon: "🖥",
        isNew: true,
      },
      {
        label: "DB Connection Monitor",
        detail: "PgBouncer pool utilisation — alert if >80% connections used",
        icon: "🔗",
        isNew: true,
      },
      {
        label: "Lineup Poll Monitor",
        detail: "Alert if lineup still unconfirmed at T-20min",
        icon: "📋",
        isNew: true,
      },
      {
        label: "Slack + Email Alerts",
        detail: "Webhook alerts for all degradation, SLA breach, stuck states",
        icon: "🚨",
      },
      {
        label: "Latency SLA",
        detail: "P99 API response time — alert if >2s pre-kickoff",
        icon: "⏱",
      },
    ],
  },

  {
    id: "trackrecord",
    layer: "11b",
    title: "PUBLIC TRACK RECORD SYSTEM",
    icon: "🏆",
    color: "#F59E0B",
    tag: "v3.2 NEW LAYER",
    tagColor: "#F59E0B",
    summary:
      "Brand new layer in v3.2. Provides verifiable, public, third-party-checkable performance metrics. Builds user trust through transparency — every prediction cryptographically timestamped before kickoff.",
    fixes: [
      "Entire layer is new in v3.2 — addresses boss requirement: 'third-party verification, leaderboard, public tracking'",
      "Every prediction is hashed and timestamped BEFORE kickoff — proves no hindsight",
      "Public API endpoint — anyone can verify the system's historical performance",
      "Tier-based accuracy display — separates HIGH-confidence picks from LOW-confidence",
      "Builds trust required for users to actually use predictions for betting decisions",
    ],
    nodes: [
      {
        label: "Prediction Hash Logger",
        detail:
          "SHA-256 hash of (prediction + match_id + timestamp) — immutable record",
        icon: "🔐",
        isNew: true,
      },
      {
        label: "Pre-Kickoff Timestamp",
        detail:
          "Cryptographic proof that prediction was made before match started",
        icon: "⏰",
        isNew: true,
      },
      {
        label: "Public Track Record API",
        detail:
          "GET /track-record/public — returns full historical prediction archive",
        icon: "🌐",
        isNew: true,
      },
      {
        label: "Verification Endpoint",
        detail:
          "GET /verify/{prediction_id} — anyone can audit a single prediction",
        icon: "🔍",
        isNew: true,
      },
      {
        label: "Live Leaderboard",
        detail: "Per-league rolling 30/90/365-day accuracy and ROI rankings",
        icon: "📊",
        isNew: true,
      },
      {
        label: "Win Rate Tracker",
        detail:
          "Aggregate win rate displayed publicly per market, per confidence tier",
        icon: "✅",
        isNew: true,
      },
      {
        label: "ROI Tracker",
        detail:
          "Kelly-sized ROI assuming flat staking — public, updated per match",
        icon: "💹",
        isNew: true,
      },
      {
        label: "CLV Public Display",
        detail:
          "Rolling CLV % positive rate — proves we beat the market over time",
        icon: "🎯",
        isNew: true,
      },
      {
        label: "Confidence-Tier Accuracy",
        detail:
          "HIGH picks accuracy vs MEDIUM vs LOW — proves tier system works",
        icon: "🚦",
        isNew: true,
      },
      {
        label: "Streak Tracking",
        detail:
          "Current win/loss streak, longest streak ever — gamification element",
        icon: "🔥",
        isNew: true,
      },
      {
        label: "Best/Worst Leagues",
        detail:
          "Public ranking of where system performs best — honesty builds trust",
        icon: "🌍",
        isNew: true,
      },
      {
        label: "Daily Performance Card",
        detail: "Auto-generated daily summary: picks made, accuracy, CLV, ROI",
        icon: "📋",
        isNew: true,
      },
      {
        label: "Historical Archive",
        detail:
          "Permanent storage of every prediction ever made — never edited",
        icon: "📚",
        isNew: true,
      },
      {
        label: "Public Audit Log",
        detail:
          "Every model change, every retrain logged publicly with timestamps",
        icon: "📝",
        isNew: true,
      },
    ],
  },

  {
    id: "retraining",
    layer: "12",
    title: "AUTOMATED RETRAINING",
    icon: "↺",
    color: "#16A34A",
    tag: "UPDATED",
    tagColor: "#16A34A",
    summary:
      "Elo feedback loop now atomic and sequenced. Retraining is matchday-aware — skips retraining if calendar shows another match for affected teams within 6 hours.",
    fixes: [
      "Elo updates now use atomic DB transactions — no race conditions on simultaneous match completions",
      "Feature freshness gate ensures same-day later matches always use updated Elo",
      "Matchday-aware scheduling — doesn't trigger expensive retrain mid-matchday",
    ],
    nodes: [
      {
        label: "Match Result Trigger",
        detail: "Airflow DAG fires 2h post final whistle via API-Football",
        icon: "⚡",
      },
      {
        label: "Atomic Elo Update",
        detail:
          "Single DB transaction per match — no partial write race condition",
        icon: "🔒",
        isNew: true,
      },
      {
        label: "Feature Freshness Write",
        detail: "valid_from = match_end_utc — gates later same-day predictions",
        icon: "⏱",
        isNew: true,
      },
      {
        label: "Matchday-Aware Trigger",
        detail: "Delays retrain if same team plays again within 6h same day",
        icon: "📅",
        isNew: true,
      },
      {
        label: "Odds Data Pull",
        detail: "Closing line captured before trigger — CLV computed",
        icon: "📈",
      },
      {
        label: "Feature Pipeline Rerun",
        detail: "All rolling features refreshed — competition-context aware",
        icon: "⚙",
      },
      {
        label: "Full Retrain",
        detail: "All 8 base models on full updated dataset",
        icon: "🔁",
      },
      {
        label: "TimeSeriesSplit CV",
        detail: "5-fold time-based CV — last 2 seasons as holdout",
        icon: "📅",
      },
      {
        label: "Champion/Challenger",
        detail: "Deploy only if RPS improves >= 1% vs champion",
        icon: "🏆",
      },
      {
        label: "Rollback Mechanism",
        detail: "MLflow auto-revert if degradation >5% vs 30d baseline",
        icon: "⏪",
      },
      {
        label: "Audit Log",
        detail: "Trigger, winner, delta metrics, decision timestamp",
        icon: "📋",
      },
    ],
  },

  {
    id: "infra",
    layer: "13",
    title: "INFRASTRUCTURE",
    icon: "◫",
    color: "#94a3b8",
    tag: "MAJOR UPDATE",
    tagColor: "#94a3b8",
    summary:
      "Infrastructure rebuilt for parallel, event-driven operation. Two separate worker pools. PgBouncer connection pooling. Priority queue. Auto-scaling. Deadline-aware scheduling.",
    fixes: [
      "Two separate worker pools — API polling never competes with heavy computation",
      "PgBouncer prevents database connection exhaustion under peak load",
      "Priority queue — nearest deadline always processed first",
      "Auto-scaling — worker pool grows during busy matchdays, shrinks during quiet periods",
      "Deadline-aware Airflow tasks — each task carries its own deadline timestamp",
    ],
    nodes: [
      {
        label: "PostgreSQL 15",
        detail:
          "Primary warehouse — UTC timestamps everywhere, row-level locking",
        icon: "🗄",
      },
      {
        label: "PgBouncer",
        detail: "Connection pooler — 30 workers share 20 real DB connections",
        icon: "🔗",
        isNew: true,
      },
      {
        label: "Feast Feature Store",
        detail: "Consistent train-time and serve-time features — no skew",
        icon: "⚙",
      },
      {
        label: "MLflow Registry",
        detail: "Experiments, versions, metrics, artifact storage",
        icon: "📦",
      },
      {
        label: "Heavy Worker Pool",
        detail:
          "10-15 workers — feature engineering, model inference, simulation",
        icon: "🖥",
        isNew: true,
      },
      {
        label: "Light Worker Pool",
        detail: "3-5 workers — API polling, lineup checks, odds updates",
        icon: "🖥",
        isNew: true,
      },
      {
        label: "Priority Queue",
        detail:
          "Deadline-first ordering — nearest kickoff always processed first",
        icon: "📊",
        isNew: true,
      },
      {
        label: "Auto-Scaling Controller",
        detail: "Queue depth >10 → add 2 workers. Depth <2 → remove one",
        icon: "📈",
        isNew: true,
      },
      {
        label: "Apache Airflow 2.x",
        detail: "DAG orchestration — dynamic task mapping per fixture",
        icon: "🌬",
      },
      {
        label: "Dynamic Task Mapping",
        detail: "One Airflow task auto-created per match — true parallelism",
        icon: "⚡",
        isNew: true,
      },
      {
        label: "Airflow Sensors",
        detail:
          "LineupSensor, ResultSensor — wait for events, don't poll on CPU",
        icon: "🔍",
        isNew: true,
      },
      {
        label: "Docker + Compose",
        detail: "All services containerised — reproducible train + serve",
        icon: "🐳",
      },
      {
        label: "GitHub Actions CI/CD",
        detail: "Auto-test + deploy on every model retrain",
        icon: "⚙",
      },
      {
        label: "Vault Secrets",
        detail: "API keys in Vault — never in .env or code",
        icon: "🔐",
      },
      {
        label: "Redis Cache",
        detail: "Prediction cache — invalidate on lineup/odds change event",
        icon: "⚡",
      },
    ],
  },

  {
    id: "api",
    layer: "14",
    title: "API + DASHBOARD",
    icon: "⬡",
    color: "#2563EB",
    tag: "v3.2 UPGRADED",
    tagColor: "#0D9488",
    summary:
      "v3.2 adds user-tier endpoints. Now serves both technical clients (NestJS backend) and end-user consumption — picks-of-the-day, public track record, confidence-tier filtering.",
    fixes: [
      "New /fixtures endpoint — consumers can query upcoming matches and their current pipeline state",
      "New /match-state endpoint — real-time state of any match in the pipeline",
      "Dashboard now shows live state machine view — see exactly where every match is",
      "v3.2: User-tier picks endpoints — clear actionable picks instead of raw probabilities",
      "v3.2: Public track record endpoint — verifiable historical performance",
      "v3.2: Confidence tier filtering — users can filter by HIGH/MEDIUM/LOW confidence",
      "v3.2: Webhook push to NestJS — auto-notifies backend when prediction ready",
    ],
    nodes: [
      {
        label: "FastAPI Predict",
        detail: "POST /predict/{match_id} — async, <200ms from cache",
        icon: "⚡",
      },
      {
        label: "Picks of the Day",
        detail: "v3.2: GET /picks/today — clean user-facing pick list",
        icon: "🎯",
        isNew: true,
      },
      {
        label: "Single Match Pick",
        detail: "v3.2: GET /picks/{match_id} — pick + reasoning + confidence",
        icon: "🎲",
        isNew: true,
      },
      {
        label: "Confidence Tier Filter",
        detail: "v3.2: GET /picks?tier=HIGH — filter by confidence level",
        icon: "🚦",
        isNew: true,
      },
      {
        label: "Public Track Record",
        detail: "v3.2: GET /track-record/public — verifiable history + ROI",
        icon: "🏆",
        isNew: true,
      },
      {
        label: "Live Leaderboard API",
        detail: "v3.2: GET /leaderboard — per-league accuracy rankings",
        icon: "📊",
        isNew: true,
      },
      {
        label: "Verification Endpoint",
        detail: "v3.2: GET /verify/{prediction_id} — audit any prediction",
        icon: "🔍",
        isNew: true,
      },
      {
        label: "Fixtures Endpoint",
        detail: "GET /fixtures?league=EPL&days=7 — upcoming with state",
        icon: "📅",
        isNew: true,
      },
      {
        label: "Match State API",
        detail: "GET /match-state/{match_id} — live pipeline state",
        icon: "⚙",
        isNew: true,
      },
      {
        label: "NestJS Webhook Push",
        detail: "v3.2: POST to NestJS when prediction ready — async push",
        icon: "📡",
        isNew: true,
      },
      {
        label: "JWT Auth",
        detail: "Bearer token — viewer / analyst / admin roles",
        icon: "🔐",
      },
      {
        label: "Internal API Key",
        detail: "v3.2: X-Internal-Key header — secures NestJS-AI traffic",
        icon: "🔑",
        isNew: true,
      },
      {
        label: "Rate Limiting",
        detail: "Redis-based per-user quota — 1000/day, 100/min burst",
        icon: "🚦",
      },
      {
        label: "Prediction Cache",
        detail: "Redis TTL — invalidate on lineup/odds change event",
        icon: "⚡",
      },
      {
        label: "Value Bet API",
        detail: "GET /value-bets?league=EPL&min_edge=0.03",
        icon: "💰",
      },
      {
        label: "SHAP Explain API",
        detail: "GET /explain/{prediction_id} — top 3 SHAP features",
        icon: "💡",
      },
      {
        label: "Grafana Dashboard",
        detail: "Model metrics, drift, latency, CLV trend",
        icon: "📊",
      },
      {
        label: "State Machine View",
        detail: "Live dashboard — all active matches and current states",
        icon: "🗺",
        isNew: true,
      },
      {
        label: "Fixture Calendar View",
        detail: "Weekly matchday overview with pipeline status per match",
        icon: "📅",
        isNew: true,
      },
      {
        label: "Automated Reports",
        detail: "Weekly PDF — performance, CLV, ROI, competition breakdown",
        icon: "📧",
      },
    ],
  },
];

// ─── THREE CLOCKS ─────────────────────────────────────────────────────────────

const THREE_CLOCKS = [
  {
    title: "WEEKLY CLOCK",
    color: "#06b6d4",
    icon: "📅",
    trigger: "Every Sunday 06:00 UTC — always runs",
    desc: "The slowest clock. Sets the agenda for the entire week ahead.",
    steps: [
      "Pull 14-day fixture schedule for all tracked leagues from API-Football",
      "Store all matches in UTC — no local time anywhere",
      "Build league profile context — break windows, congestion risk dates",
      "Generate per-match deadline timestamps (kickoff_utc - 60min)",
      "Build priority queue — order all matches by deadline ASC",
      "Flag any team with 3+ matches in next 7 days as high-congestion",
      "Alert if any expected fixture is missing (postponed before detection)",
    ],
  },
  {
    title: "MATCH CLOCK",
    color: "#a78bfa",
    icon: "⚽",
    trigger: "Runs independently per match — event-driven from fixture table",
    desc: "One clock per match, running in parallel for all simultaneous games.",
    steps: [
      "T-24h: Spawn dedicated Airflow task for this match with its deadline",
      "T-24h: Pull all historical features — Elo (freshness-gated), form, H2H, odds, referee",
      "T-24h: Compute pre-lineup features — rest hours, congestion score, travel, weather",
      "T-90m: Transition to LINEUP_PENDING — Airflow LineupSensor starts polling every 5min",
      "T-confirmed: Lineup arrives — recalculate player impact + injury impact immediately",
      "T-confirmed: Run all 8 base models in parallel — one thread per model",
      "T-confirmed: Stack ensemble, calibrate, simulate, generate SHAP, cache in Redis",
      "T-5m: Final odds snapshot — mark as closing, record CLV baseline for this match",
      "Kickoff: Transition to LIVE — no further prediction updates in Phase 1",
    ],
  },
  {
    title: "POST-MATCH CLOCK",
    color: "#16A34A",
    icon: "✔",
    trigger: "Fires 2h after final whistle — driven by result detection",
    desc: "Closes the feedback loop. Updates all features so the next prediction is better.",
    steps: [
      "FT+0h: Result ingested — transition match to COMPLETED state",
      "FT+1h: Collect final xG from Understat — updated ~1h post-match",
      "FT+1h: Capture closing odds — compute CLV for this prediction",
      "FT+2h: Atomic Elo update — single DB transaction, both teams, no partial state",
      "FT+2h: Write valid_from = match_end_utc — freshness gate for same-day later matches",
      "FT+2h: Recompute all rolling features — competition-context aware",
      "FT+2h: Check if either team plays again within 6h — if yes, delay retrain to end of matchday",
      "FT+3h: Champion/Challenger retrain — deploy only if RPS improves >= 1%",
      "FT+3h: PSI drift check — Slack alert if any feature drift > 0.2",
      "FT+4h: Archive match — write full audit record, CLV result, model version used",
    ],
  },
];

// ─── ALL FIXES SUMMARY ───────────────────────────────────────────────────────

const ALL_FIXES = [
  {
    category: "NEW LAYERS ADDED",
    color: "#06b6d4",
    items: [
      {
        title: "Fixture Intelligence Engine",
        layer: "02",
        impact: "CRITICAL",
        desc: "The system had no calendar awareness. It couldn't know when matches started, detect postponements, handle simultaneous leagues, or compute per-match deadlines. This layer is the nervous system of time-awareness.",
      },
      {
        title: "Match State Machine",
        layer: "04",
        impact: "CRITICAL",
        desc: "Pipeline ran on fixed time triggers — causing duplicate runs, missed predictions, and no recovery path when things went wrong. State machine gives every match a clear lifecycle with defined transitions and stuck-state detection.",
      },
    ],
  },
  {
    category: "TIME INTELLIGENCE FIXES",
    color: "#f59e0b",
    items: [
      {
        title: "Hour-Precision Rest Calculator",
        layer: "05",
        impact: "HIGH",
        desc: "Rest was measured in days. A team finishing at 10PM Thursday playing 12:30PM Saturday has 62.5h rest. Another playing Sunday 5:30PM has 168h. Day-level precision missed this entirely.",
      },
      {
        title: "UTC Enforcement Everywhere",
        layer: "03",
        impact: "HIGH",
        desc: "Local times caused predictions to fire an hour early or late twice a year during DST transitions. UTC throughout the entire pipeline eliminates this class of failure permanently.",
      },
      {
        title: "Form Staleness Detection",
        layer: "05",
        impact: "HIGH",
        desc: "A team's last 5 matches could span 3 months if they crossed an international break. Form features weren't flagged as stale. Now staleness reduces the weight of form features when gap spans a break.",
      },
      {
        title: "Elo Freshness Gate",
        layer: "05",
        impact: "HIGH",
        desc: "Late Premier League matches were using pre-Bundesliga Elo values even when Bundesliga had already finished. Freshness gate (valid_from timestamp) ensures only current Elo is used.",
      },
      {
        title: "Same-Day Elo Sequencing",
        layer: "05",
        impact: "MEDIUM",
        desc: "After early kickoffs complete, their Elo updates are now available to later same-day predictions. This closes the intra-day feedback loop that was previously completely absent.",
      },
      {
        title: "Kickoff Slot Feature",
        layer: "05",
        impact: "MEDIUM",
        desc: "The 12:30 Saturday slot, Monday Night Football, and Sunday evening slots all have different rest and motivation contexts. Encoding the slot gives the model a consistent signal about these patterns.",
      },
      {
        title: "Congestion Score Feature",
        layer: "05",
        impact: "HIGH",
        desc: "Simple days-since-last-match missed the full fatigue picture. Congestion score counts matches in the last 7, 14, 21 days AND upcoming matches — capturing both accumulated fatigue and rotation likelihood.",
      },
    ],
  },
  {
    category: "PARALLEL PROCESSING FIXES",
    color: "#a78bfa",
    items: [
      {
        title: "Two Separate Worker Pools",
        layer: "13",
        impact: "CRITICAL",
        desc: "API polling tasks (lightweight, frequent) were competing with feature computation tasks (heavyweight, slow). Now split into Light Pool (3-5 workers for polling) and Heavy Pool (10-15 workers for computation).",
      },
      {
        title: "PgBouncer Connection Pooling",
        layer: "13",
        impact: "CRITICAL",
        desc: "30 parallel workers hitting PostgreSQL directly would exhaust its connection limit. PgBouncer multiplexes all workers through 20 real connections. Prevents a whole class of mysterious production failures.",
      },
      {
        title: "Priority Queue — Deadline First",
        layer: "13",
        impact: "HIGH",
        desc: "FIFO queue would process matches in arrival order — earliest kickoffs could be last processed. Priority queue ensures the match with the nearest deadline always gets the next available worker.",
      },
      {
        title: "Dynamic Task Mapping",
        layer: "13",
        impact: "HIGH",
        desc: "Airflow previously had static DAGs. Dynamic task mapping creates exactly one task per fixture automatically — 20 matches = 20 parallel tasks. No manual DAG updates when leagues are added.",
      },
      {
        title: "Airflow Sensors for Events",
        layer: "13",
        impact: "HIGH",
        desc: "Lineup polling was burning CPU in busy-wait loops. Airflow LineupSensor and ResultSensor block without consuming CPU — they wait for events and only resume when the condition is met.",
      },
      {
        title: "Auto-Scaling Controller",
        layer: "13",
        impact: "MEDIUM",
        desc: "Fixed worker pools waste resources on quiet days and struggle on busy ones. Auto-scaler adds workers when queue depth exceeds 10 and removes them when it drops below 2.",
      },
    ],
  },
  {
    category: "OPERATIONAL RESILIENCE FIXES",
    color: "#ef4444",
    items: [
      {
        title: "Postponement Detection Pipeline",
        layer: "11",
        impact: "CRITICAL",
        desc: "A postponed match would sit in LINEUP_PENDING forever. Now fixture status is polled every 4h. Postponement detected → pipeline cancelled → Slack alert → fixture marked as postponed.",
      },
      {
        title: "Atomic Elo Update Transactions",
        layer: "12",
        impact: "HIGH",
        desc: "Parallel Elo updates for simultaneous matches could read/write in conflicting order. Single DB transaction per match reads both teams' current Elo, computes new values, writes both atomically.",
      },
      {
        title: "Stuck State Detection",
        layer: "11",
        impact: "HIGH",
        desc: "No visibility into stalled matches. Now every state has a maximum expected duration. Matches exceeding it trigger immediate Slack alert with match_id, current state, and time stuck.",
      },
      {
        title: "Matchday-Aware Retrain Trigger",
        layer: "12",
        impact: "MEDIUM",
        desc: "Expensive retraining was firing mid-matchday, consuming resources needed for active predictions. Now checks if either team plays again within 6h — if so, delays retrain to end of matchday.",
      },
      {
        title: "Per-Match SLA vs Global SLA",
        layer: "11",
        impact: "HIGH",
        desc: "Global SLA alert fired at a single fixed time — useless for matches with different kickoffs. Per-match SLA tracks each match against its own deadline individually.",
      },
      {
        title: "Reschedule Detection + Feature Update",
        layer: "11",
        impact: "MEDIUM",
        desc: "Rescheduled matches create congestion asymmetry that old features missed. Detector flags rescheduled matches and triggers immediate congestion feature recomputation for affected teams.",
      },
    ],
  },
  {
    category: "EVALUATION & OUTPUT FIXES",
    color: "#fb923c",
    items: [
      {
        title: "Per-Competition Evaluation",
        layer: "10",
        impact: "HIGH",
        desc: "League predictions and cup predictions were evaluated together. Cup early rounds with rotated squads look like bad league predictions in aggregate. Now tracked separately.",
      },
      {
        title: "Congestion Band Analysis",
        layer: "10",
        impact: "MEDIUM",
        desc: "Does model accuracy drop when teams play 3+ matches in 7 days? Previously unknown. Now explicitly tracked as a performance dimension.",
      },
      {
        title: "Form Staleness Flag in Output",
        layer: "09",
        impact: "MEDIUM",
        desc: "Consumers had no way to know if a prediction was based on stale post-break form. Flag now included in every prediction payload with the staleness severity level.",
      },
      {
        title: "Rest Differential in Output",
        layer: "09",
        impact: "MEDIUM",
        desc: "Home hours rest minus away hours rest was computed internally but never exposed. Now returned in the prediction payload — useful for bettors evaluating prediction confidence.",
      },
      {
        title: "Kickoff Slot Evaluation",
        layer: "10",
        impact: "LOW",
        desc: "Do 12:30 Saturday predictions systematically underperform? This analysis is now tracked as a first-class evaluation dimension over rolling 30-match windows.",
      },
    ],
  },
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function LayerCard({ layer, isSelected, onToggle, index, ready }) {
  const newCount = layer.nodes.filter((n) => n.isNew).length;
  const tagColors = {
    "NEW LAYER": "#06b6d4",
    "MAJOR UPDATE": "#f59e0b",
    UPDATED: "#4dabf7",
    STABLE: "#16A34A",
  };
  const tc = tagColors[layer.tag] || "#16A34A";

  return (
    <div
      style={{
        marginBottom: 3,
        opacity: ready ? 1 : 0,
        transform: ready ? "none" : "translateX(-16px)",
        transition: `opacity 0.4s ease ${index * 0.035}s, transform 0.4s ease ${index * 0.035}s`,
      }}
    >
      <div style={{ display: "flex", alignItems: "stretch" }}>
        {/* Layer label */}
        <div
          style={{
            width: 200,
            flexShrink: 0,
            borderRight: `2px solid ${isSelected ? layer.color : "#E2E8F0"}`,
            padding: "10px 14px 10px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            transition: "border-color 0.2s",
          }}
        >
          <div style={{ textAlign: "right", marginRight: 8 }}>
            <div style={{ fontSize: 7, color: "#94A3B8", letterSpacing: 3 }}>
              LAYER {layer.layer}
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: isSelected ? layer.color : "#94A3B8",
                transition: "color 0.2s",
                lineHeight: 1.3,
              }}
            >
              {layer.title}
            </div>
            <div
              style={{
                marginTop: 3,
                display: "flex",
                gap: 4,
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 7,
                  color: tc,
                  background: tc + "15",
                  padding: "1px 5px",
                  borderRadius: 99,
                }}
              >
                {layer.tag}
              </span>
              {newCount > 0 && (
                <span
                  style={{
                    fontSize: 7,
                    color: "#16A34A",
                    background: "rgba(22,163,74,0.08)",
                    padding: "1px 5px",
                    borderRadius: 99,
                  }}
                >
                  +{newCount} NEW
                </span>
              )}
            </div>
          </div>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              flexShrink: 0,
              background: isSelected ? layer.color + "18" : "rgba(0,0,0,0.04)",
              border: `1px solid ${isSelected ? layer.color + "44" : "rgba(0,0,0,0.06)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isSelected ? layer.color : "#94A3B8",
              fontSize: 13,
              transition: "all 0.2s",
            }}
          >
            {layer.icon}
          </div>
        </div>

        {/* Connector */}
        <div style={{ width: 22, flexShrink: 0, position: "relative" }}>
          <div
            style={{
              width: 1,
              height: "100%",
              position: "absolute",
              left: 11,
              background: `linear-gradient(${layer.color}22, ${layer.color}08)`,
            }}
          />
        </div>

        {/* Nodes */}
        <button
          onClick={onToggle}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px 0 8px 8px",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {layer.nodes.map((node, ni) => (
              <span
                key={ni}
                style={{
                  padding: "4px 9px",
                  borderRadius: 4,
                  fontSize: 9,
                  background: node.isNew
                    ? "rgba(22,163,74,0.06)"
                    : "rgba(0,0,0,0.03)",
                  border: `1px solid ${node.isNew ? "rgba(22,163,74,0.4)" : "#E2E8F0"}`,
                  color: node.isNew ? "#16A34A" : "#64748B",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 10 }}>{node.icon}</span>
                {node.label}
                {node.isNew && (
                  <span style={{ fontSize: 6, color: "#16A34A" }}>●</span>
                )}
              </span>
            ))}
          </div>
        </button>
      </div>

      {/* Expanded detail */}
      {isSelected && (
        <div
          style={{
            marginTop: 3,
            background: "#FFFFFF",
            border: `1px solid ${layer.color}30`,
            borderTop: `2px solid ${layer.color}`,
            borderRadius: "0 0 10px 10px",
            padding: "18px 22px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#475569",
              lineHeight: 1.8,
              marginBottom: 14,
              borderLeft: `3px solid ${layer.color}`,
              paddingLeft: 12,
            }}
          >
            {layer.summary}
          </div>
          {layer.fixes.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 8,
                  color: "#16A34A",
                  letterSpacing: 3,
                  marginBottom: 8,
                }}
              >
                WHAT WAS FIXED
              </div>
              {layer.fixes.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 7,
                    padding: "5px 0",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <span
                    style={{
                      color: "#16A34A",
                      fontSize: 9,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    ▸
                  </span>
                  <span
                    style={{ fontSize: 10, color: "#475569", lineHeight: 1.5 }}
                  >
                    {f}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              fontSize: 8,
              color: "#94A3B8",
              letterSpacing: 3,
              marginBottom: 10,
            }}
          >
            ALL COMPONENTS
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
              gap: 6,
            }}
          >
            {layer.nodes.map((node, ni) => (
              <div
                key={ni}
                style={{
                  padding: "9px 11px",
                  background: node.isNew
                    ? "rgba(22,163,74,0.05)"
                    : "rgba(0,0,0,0.04)",
                  border: `1px solid ${node.isNew ? "rgba(22,163,74,0.18)" : "rgba(0,0,0,0.06)"}`,
                  borderRadius: 7,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  <span style={{ fontSize: 12 }}>{node.icon}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: node.isNew ? "#16A34A" : "#1E293B",
                    }}
                  >
                    {node.label}
                  </span>
                  {node.isNew && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 7,
                        color: "#16A34A",
                        background: "rgba(22,163,74,0.08)",
                        padding: "1px 5px",
                        borderRadius: 99,
                      }}
                    >
                      NEW
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#94A3B8",
                    paddingLeft: 18,
                    lineHeight: 1.4,
                  }}
                >
                  {node.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ThreeClocksView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          fontSize: 11,
          color: "#475569",
          lineHeight: 1.8,
          padding: "14px 18px",
          background: "rgba(0,0,0,0.02)",
          border: "1px solid #E2E8F0",
          borderRadius: 10,
        }}
      >
        The system runs on{" "}
        <strong style={{ color: "#1E293B" }}>
          three independent clocks simultaneously
        </strong>{" "}
        — never idle, never blocking each other. The Weekly Clock sets the
        agenda. The Match Clock runs in parallel for every active match. The
        Post-Match Clock closes the feedback loop after each result.
      </div>
      {THREE_CLOCKS.map((clock, ci) => (
        <div key={ci}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 18 }}>{clock.icon}</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
              {clock.title}
            </div>
            <div
              style={{
                fontSize: 9,
                color: clock.color,
                background: clock.color + "15",
                padding: "3px 10px",
                borderRadius: 99,
              }}
            >
              {clock.trigger}
            </div>
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#64748B",
              marginBottom: 8,
              paddingLeft: 4,
            }}
          >
            {clock.desc}
          </div>
          <div
            style={{
              background: "#FFFFFF",
              border: `1px solid ${clock.color}25`,
              borderLeft: `3px solid ${clock.color}`,
              borderRadius: "0 10px 10px 0",
              overflow: "hidden",
            }}
          >
            {clock.steps.map((step, si) => (
              <div
                key={si}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "9px 16px",
                  borderBottom:
                    si < clock.steps.length - 1
                      ? "1px solid rgba(0,0,0,0.05)"
                      : "none",
                  background: si % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: clock.color + "15",
                    border: `1px solid ${clock.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 8,
                    color: clock.color,
                    fontWeight: 700,
                  }}
                >
                  {si + 1}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#475569",
                    lineHeight: 1.6,
                    paddingTop: 2,
                  }}
                >
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AllFixesView() {
  const [open, setOpen] = useState(null);
  const total = ALL_FIXES.reduce((a, g) => a + g.items.length, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))",
          gap: 8,
        }}
      >
        {[
          { n: 2, label: "NEW LAYERS", c: "#06b6d4" },
          { n: 7, label: "TIME FIXES", c: "#f59e0b" },
          { n: 6, label: "PARALLEL FIXES", c: "#a78bfa" },
          { n: 6, label: "RESILIENCE FIXES", c: "#ef4444" },
          { n: 5, label: "EVALUATION FIXES", c: "#fb923c" },
          { n: total, label: "TOTAL FIXES", c: "#16A34A" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: s.c + "09",
              border: `1px solid ${s.c}22`,
              borderRadius: 9,
              padding: "12px 10px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: s.c }}>
              {s.n}
            </div>
            <div
              style={{
                fontSize: 7,
                color: s.c,
                letterSpacing: 2,
                marginTop: 2,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {ALL_FIXES.map((group, gi) => (
        <div key={gi}>
          <div
            style={{
              fontSize: 8,
              color: group.color,
              letterSpacing: 4,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: group.color,
              }}
            />
            {group.category} — {group.items.length} ITEMS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {group.items.map((item, ii) => {
              const key = `${gi}-${ii}`;
              const isOpen = open === key;
              const impactColor = {
                CRITICAL: "#ef4444",
                HIGH: "#f59e0b",
                MEDIUM: "#3b82f6",
                LOW: "#16A34A",
              }[item.impact];
              return (
                <div
                  key={ii}
                  style={{
                    background: "rgba(0,0,0,0.02)",
                    border: `1px solid ${group.color}14`,
                    borderLeft: `2px solid ${group.color}`,
                    borderRadius: "0 9px 9px 0",
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : key)}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "12px 16px",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 3,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 8,
                            color: impactColor,
                            background: impactColor + "15",
                            padding: "1px 6px",
                            borderRadius: 99,
                          }}
                        >
                          {item.impact}
                        </span>
                        <span style={{ fontSize: 8, color: "#94A3B8" }}>
                          LAYER {item.layer}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#0F172A",
                        }}
                      >
                        {item.title}
                      </div>
                    </div>
                    <span
                      style={{ color: "#94A3B8", fontSize: 14, flexShrink: 0 }}
                    >
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 16px 14px" }}>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#475569",
                          lineHeight: 1.8,
                          borderLeft: `2px solid ${group.color}`,
                          paddingLeft: 10,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("pipeline");
  const [selected, setSelected] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const totalNew = ARCH.reduce(
    (a, l) => a + l.nodes.filter((n) => n.isNew).length,
    0,
  );
  const totalFixes = ALL_FIXES.reduce((a, g) => a + g.items.length, 0);

  const TABS = [
    { id: "pipeline", label: "Pipeline" },
    { id: "clocks", label: "3 Clocks" },
    { id: "fixes", label: "All Fixes" },
  ];

  return (
    <div
      style={{
        fontFamily: "'Segoe UI',Arial,sans-serif",
        background: "#F1F5F9",
        minHeight: "100vh",
        color: "#1E293B",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(30,58,95,0.04) 1px,transparent 1px),
          linear-gradient(90deg,rgba(30,58,95,0.04) 1px,transparent 1px)`,
          backgroundSize: "44px 44px",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── HEADER ── */}
        <div
          style={{
            borderBottom: "1px solid #E2E8F0",
            background: "#FFFFFF",
            backdropFilter: "blur(20px)",
            padding: "16px 24px",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ maxWidth: 1380, margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 8,
                    letterSpacing: 5,
                    color: "#0D9488",
                    marginBottom: 4,
                  }}
                >
                  SYSTEM ARCHITECTURE v3.2 — USER-FACING PICKS · PUBLIC TRACK
                  RECORD · CONTINUOUS POLLING
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#0F172A",
                    letterSpacing: 1,
                  }}
                >
                  Football AI Prediction Engine
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#94A3B8",
                    marginTop: 2,
                    letterSpacing: 1,
                  }}
                >
                  16 LAYERS · 3-CLOCK ARCHITECTURE · EVENT-DRIVEN · 1X2 + AH +
                  O/U + ACTIONABLE PICKS
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { v: 16, label: "LAYERS", c: "#0D9488" },
                  { v: 2, label: "NEW IN v3.2", c: "#10B981" },
                  { v: "34", label: "FEATURES", c: "#16A34A" },
                  { v: "3", label: "MARKETS", c: "#f59e0b" },
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      textAlign: "center",
                      padding: "6px 12px",
                      background: "rgba(0,0,0,0.04)",
                      border: "1px solid rgba(0,0,0,0.04)",
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: s.c,
                        lineHeight: 1,
                      }}
                    >
                      {s.v}
                    </div>
                    <div
                      style={{
                        fontSize: 7,
                        color: "#94A3B8",
                        letterSpacing: 2,
                        marginTop: 2,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Version diff badges */}
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 10,
              }}
            >
              {[
                { label: "v3.1: 14 layers", c: "#94A3B8" },
                { label: "→", c: "#94A3B8" },
                { label: "v3.2: 16 layers", c: "#0D9488" },
                { label: "New: Pick Translation Layer (09b)", c: "#10B981" },
                { label: "New: Public Track Record (11b)", c: "#F59E0B" },
                { label: "Upgraded: Continuous Odds Polling", c: "#06b6d4" },
                { label: "Upgraded: Risk Level Output", c: "#a78bfa" },
                { label: "Upgraded: User-Tier API Endpoints", c: "#2563EB" },
              ].map((b, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 8,
                    color: b.c,
                    background: i > 1 ? b.c + "12" : "transparent",
                    border: i > 1 ? `1px solid ${b.c}25` : "none",
                    padding: i > 1 ? "2px 8px" : "2px 2px",
                    borderRadius: 99,
                  }}
                >
                  {b.label}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    setSelected(null);
                  }}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 9,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    border:
                      tab === t.id ? "1px solid #2563EB" : "1px solid #E2E8F0",
                    background:
                      tab === t.id ? "rgba(37,99,235,0.08)" : "transparent",
                    color: tab === t.id ? "#2563EB" : "#64748B",
                    transition: "all 0.15s",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 1380, margin: "0 auto", padding: "20px 24px" }}>
          {/* Pipeline */}
          {tab === "pipeline" && (
            <div>
              <div
                style={{
                  fontSize: 8,
                  color: "#94A3B8",
                  letterSpacing: 3,
                  marginBottom: 16,
                }}
              >
                CLICK ANY LAYER TO EXPAND · GREEN = NEW/UPDATED NODES · TEAL =
                NEW LAYERS
              </div>
              {ARCH.map((layer, li) => (
                <LayerCard
                  key={layer.id}
                  layer={layer}
                  isSelected={selected === li}
                  onToggle={() => setSelected(selected === li ? null : li)}
                  index={li}
                  ready={ready}
                />
              ))}
            </div>
          )}

          {/* Three Clocks */}
          {tab === "clocks" && <ThreeClocksView />}

          {/* All Fixes */}
          {tab === "fixes" && <AllFixesView />}
        </div>
      </div>
    </div>
  );
}
