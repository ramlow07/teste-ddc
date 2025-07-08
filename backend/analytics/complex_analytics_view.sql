-- =====================================================
-- SIMPLIFIED ANALYTICS VIEW
-- =====================================================
-- A comprehensive but optimized analytics view
-- Combines all tables with useful metrics and calculations
-- =====================================================

CREATE OR REPLACE VIEW workspace.simplified_analytics AS
WITH 
-- CTE 1: User Metrics
user_metrics AS (
    SELECT 
        u.id as user_id,
        u.email,
        u.name,
        u."createdAt" as user_created,
        EXTRACT(epoch FROM (NOW() - u."createdAt")) / 86400.0 as user_age_days,
        CASE 
            WHEN SPLIT_PART(u.email, '@', 2) LIKE '%.com' THEN 'commercial'
            WHEN SPLIT_PART(u.email, '@', 2) LIKE '%.org' THEN 'organization' 
            WHEN SPLIT_PART(u.email, '@', 2) LIKE '%.edu' THEN 'education'
            WHEN SPLIT_PART(u.email, '@', 2) LIKE 'gmail.%' THEN 'google'
            ELSE 'other'
        END as email_domain_type
    FROM workspace."User" u
),

-- CTE 2: Post Statistics
post_stats AS (
    SELECT 
        p."authorId",
        COUNT(*) as total_posts,
        COUNT(CASE WHEN p.published THEN 1 END) as published_posts,
        AVG(COALESCE(LENGTH(p.content), 0)) as avg_content_length,
        MAX(p."createdAt") as last_post_date
    FROM workspace."Post" p
    GROUP BY p."authorId"
),

-- CTE 3: Category Usage
category_usage AS (
    SELECT 
        p."authorId",
        COUNT(DISTINCT pc."categoryId") as unique_categories,
        COUNT(pc."postId") as total_category_assignments
    FROM workspace."Post" p
    JOIN workspace."PostCategory" pc ON p.id = pc."postId"
    GROUP BY p."authorId"
),

-- CTE 4: Profile Information
profile_info AS (
    SELECT 
        pr."userId",
        CASE 
            WHEN pr.bio IS NOT NULL AND LENGTH(pr.bio) > 100 THEN 'comprehensive'
            WHEN pr.bio IS NOT NULL AND LENGTH(pr.bio) > 50 THEN 'moderate'
            WHEN pr.bio IS NOT NULL AND LENGTH(pr.bio) > 0 THEN 'basic'
            ELSE 'incomplete'
        END as profile_completeness,
        COALESCE(LENGTH(pr.bio), 0) as bio_length
    FROM workspace."Profile" pr
),

-- CTE 5: Simplified Large Table Stats
large_table_summary AS (
    SELECT 
        COUNT(*) as total_records,
        AVG(value) as avg_value,
        MIN(value) as min_value,
        MAX(value) as max_value,
        STDDEV(value) as stddev_value
    FROM workspace."LargeTable"
)

-- MAIN SELECT: Simplified Analytics
SELECT 
    -- User Identification
    um.user_id,
    um.email,
    um.name as user_name,
    um.user_created,
    um.user_age_days,
    um.email_domain_type,
    
    -- Profile Information
    COALESCE(pi.profile_completeness, 'no_profile') as profile_status,
    COALESCE(pi.bio_length, 0) as bio_length,
    
    -- Content Metrics
    COALESCE(ps.total_posts, 0) as total_posts,
    COALESCE(ps.published_posts, 0) as published_posts,
    COALESCE(ps.avg_content_length, 0) as avg_content_length,
    ps.last_post_date,
    
    -- Category Engagement
    COALESCE(cu.unique_categories, 0) as unique_categories_used,
    COALESCE(cu.total_category_assignments, 0) as total_category_assignments,
    CASE 
        WHEN cu.total_category_assignments > 0 
        THEN ROUND((cu.unique_categories::NUMERIC / cu.total_category_assignments * 100), 2)
        ELSE 0 
    END as category_diversity_percentage,
    
    -- User Classification
    CASE 
        WHEN COALESCE(ps.total_posts, 0) > 10 AND COALESCE(cu.unique_categories, 0) > 3 
            THEN 'power_user'
        WHEN COALESCE(ps.total_posts, 0) > 5 
            THEN 'active_user'
        WHEN COALESCE(ps.total_posts, 0) > 0 
            THEN 'contributor'
        WHEN um.user_age_days <= 7 
            THEN 'new_user'
        ELSE 'inactive_user'
    END as user_classification,
    
    -- Activity Status
    CASE 
        WHEN ps.last_post_date >= NOW() - INTERVAL '7 days' THEN 'highly_active'
        WHEN ps.last_post_date >= NOW() - INTERVAL '30 days' THEN 'moderately_active'
        WHEN ps.last_post_date >= NOW() - INTERVAL '90 days' THEN 'occasionally_active'
        WHEN ps.last_post_date IS NOT NULL THEN 'dormant'
        ELSE 'no_activity'
    END as activity_status,
    
    -- Simple Engagement Score
    (
        COALESCE(ps.total_posts, 0) * 2 +
        COALESCE(ps.published_posts, 0) * 3 +
        COALESCE(cu.unique_categories, 0) * 1.5 +
        CASE pi.profile_completeness
            WHEN 'comprehensive' THEN 10
            WHEN 'moderate' THEN 5
            WHEN 'basic' THEN 2
            ELSE 0
        END
    ) as engagement_score,
    
    -- Analysis Metadata
    NOW() as analysis_generated_at,
    (SELECT total_records FROM large_table_summary) as system_data_points

FROM user_metrics um
LEFT JOIN post_stats ps ON um.user_id = ps."authorId"
LEFT JOIN category_usage cu ON um.user_id = cu."authorId"  
LEFT JOIN profile_info pi ON um.user_id = pi."userId"
CROSS JOIN large_table_summary

ORDER BY 
    engagement_score DESC,
    um.user_created ASC;

-- =====================================================
-- PERFORMANCE NOTES:
-- This simplified view removes the most expensive operations:
-- - No PERCENTILE_CONT with OVER clause
-- - No complex JSON aggregations
-- - No correlated subqueries in SELECT
-- - Simplified window functions
-- - Efficient GROUP BY operations
-- ===================================================== 