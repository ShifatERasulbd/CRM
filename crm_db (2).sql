-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2026 at 05:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crm_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `salary` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `first_name`, `last_name`, `email`, `phone`, `position`, `department`, `hire_date`, `salary`, `created_at`, `updated_at`) VALUES
(1, 'Shifat E', 'Rasul', 'shifaterasulweewebd@gmail.com', '01871769835', 'Graphics Designer', 'adfasdfad', '2025-12-01', 2323.00, '2025-12-25 06:07:40', '2025-12-25 06:07:40');

-- --------------------------------------------------------

--
-- Table structure for table `employee_login_histories`
--

CREATE TABLE `employee_login_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `login_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_login_histories`
--

INSERT INTO `employee_login_histories` (`id`, `employee_id`, `login_at`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-01-04 01:30:28', '2026-01-04 01:30:28', '2026-01-04 01:30:28'),
(2, 1, '2026-01-04 01:36:08', '2026-01-04 01:36:08', '2026-01-04 01:36:08');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `interactions`
--

CREATE TABLE `interactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `lead_id` bigint(20) UNSIGNED NOT NULL,
  `notes` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `interactions`
--

INSERT INTO `interactions` (`id`, `lead_id`, `notes`, `created_at`, `updated_at`) VALUES
(1, 2, 'dfadfadfa', '2025-12-26 23:13:04', '2025-12-26 23:13:04'),
(2, 2, 'afadfwerwafa', '2025-12-26 23:26:05', '2025-12-26 23:26:05');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'new',
  `source` varchar(255) DEFAULT NULL,
  `assigned_to` bigint(20) UNSIGNED DEFAULT NULL,
  `service_person_id` int(11) DEFAULT NULL,
  `service_person_joining_date` date DEFAULT NULL,
  `service_person_end_date` date DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `notes` text DEFAULT NULL,
  `is_converted` tinyint(1) NOT NULL DEFAULT 0,
  `converted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `service_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reference_by_customer` bigint(20) UNSIGNED DEFAULT NULL,
  `reference_by_staff` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`id`, `first_name`, `last_name`, `email`, `phone`, `company`, `status`, `source`, `assigned_to`, `service_person_id`, `service_person_joining_date`, `service_person_end_date`, `created_by`, `notes`, `is_converted`, `converted_at`, `created_at`, `updated_at`, `service_id`, `reference_by_customer`, `reference_by_staff`) VALUES
(2, 'Shifat E', 'Rasul', 'shifaterasulbd@gmail.com', '01871769666', NULL, 'customer', NULL, 1, 1, '2025-12-01', '2025-12-31', 1, 'adfadfadf', 0, NULL, '2025-12-25 07:30:42', '2025-12-31 20:20:25', 1, NULL, NULL),
(4, 'Shifat E', 'Rasul', 'shifaterasul342bd@gmail.com', '01871769835', NULL, 'contracting', 'facebook', 1, NULL, NULL, NULL, 1, 'adfadsfa', 0, NULL, '2025-12-28 00:19:34', '2026-01-04 02:00:10', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `lead_service_people`
--

CREATE TABLE `lead_service_people` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `lead_id` bigint(20) UNSIGNED NOT NULL,
  `service_person_id` bigint(20) UNSIGNED NOT NULL,
  `joining_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lead_service_people`
--

INSERT INTO `lead_service_people` (`id`, `lead_id`, `service_person_id`, `joining_date`, `end_date`, `created_at`, `updated_at`) VALUES
(20, 4, 1, '2025-12-26', '2026-01-03', '2026-01-04 02:00:10', '2026-01-04 02:00:10'),
(21, 4, 2, '2026-01-24', '2026-01-29', '2026-01-04 02:00:10', '2026-01-04 02:00:10'),
(22, 2, 1, '2026-01-21', '2026-02-06', '2026-01-04 02:17:57', '2026-01-04 02:17:57');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_12_20_151205_create_leads_table', 1),
(5, '2025_12_20_161802_create_personal_access_tokens_table', 1),
(6, '2025_12_21_000001_create_customers_table', 1),
(7, '2025_12_21_043605_create_oppertunities_table', 1),
(8, '2025_12_21_050000_create_deals_table', 1),
(9, '2025_12_21_051000_create_services_table', 1),
(10, '2025_12_21_060000_create_activities_table', 1),
(11, '2025_12_21_070000_create_task_followups_table', 1),
(12, '2025_12_21_080000_create_employees_table', 1),
(13, '2025_12_21_100000_add_service_id_to_leads_table', 1),
(14, '2025_12_24_000000_create_service_people_table', 2),
(15, '2025_12_25_154517_add_service_person_id_to_leads_table', 3),
(16, '2025_12_27_000001_create_interactions_table', 4),
(17, '2025_12_27_120000_add_service_person_dates_to_leads_table', 5),
(18, '2025_12_28_000000_add_reference_fields_to_leads_table', 6),
(19, '2025_12_29_000000_create_lead_service_people_table', 7),
(20, '2026_01_04_000001_add_salary_to_service_people_table', 8),
(21, '2026_01_04_000002_create_employee_login_histories_table', 9);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'crm-token', 'dba45c1351d8fbb182750dd54a7817598c5490bed4a5816483570d103654911f', '[\"*\"]', NULL, NULL, '2025-12-21 08:52:17', '2025-12-21 08:52:17'),
(2, 'App\\Models\\User', 1, 'crm-token', '6a15362ebf02a41c1b85c0af3ac022af136fc9acf1400c1d4385c516205d360a', '[\"*\"]', '2025-12-21 08:52:57', NULL, '2025-12-21 08:52:47', '2025-12-21 08:52:57'),
(3, 'App\\Models\\User', 1, 'crm-token', '9b5d1d39bd4ae1ecfe944e5b73aba0c7730f66185d757344a197a2bf1cf773a3', '[\"*\"]', '2025-12-21 09:29:41', NULL, '2025-12-21 08:53:44', '2025-12-21 09:29:41'),
(4, 'App\\Models\\User', 2, 'crm-token', '6f3ed6331df282e214088d5ac729c27ebd07bd85600931237bba77a5cec479c7', '[\"*\"]', '2025-12-21 09:48:11', NULL, '2025-12-21 09:48:04', '2025-12-21 09:48:11'),
(5, 'App\\Models\\User', 1, 'crm-token', 'c4c28d2a74fb736dc00b85fe34f88bfabc8bf76fe1f33cd2d05fb6b5a06cf96e', '[\"*\"]', '2025-12-21 09:53:40', NULL, '2025-12-21 09:48:38', '2025-12-21 09:53:40'),
(6, 'App\\Models\\User', 4, 'crm-token', '2122a8c9c6e0408f9be79521c40924e58908f566e85356c0bb4f8fa3086ef70d', '[\"*\"]', '2025-12-21 09:54:03', NULL, '2025-12-21 09:54:00', '2025-12-21 09:54:03'),
(7, 'App\\Models\\User', 1, 'crm-token', '7ec3ec112e615911e2ee07b13e52ce1f1244bd1b719f2ca69d8191ebd66564ed', '[\"*\"]', '2025-12-21 20:58:04', NULL, '2025-12-21 09:54:23', '2025-12-21 20:58:04'),
(8, 'App\\Models\\User', 1, 'crm-token', '6ba1be232aa47a0685d057a02285a82e0bcfcabed0e606d1d67b12d4151e9fa2', '[\"*\"]', '2025-12-21 21:09:40', NULL, '2025-12-21 20:58:16', '2025-12-21 21:09:40'),
(9, 'App\\Models\\User', 4, 'crm-token', 'a7d5dd35bc3d2b30add42ca46873dd92fd8e6cfcdcc2bc76279543ce0d842b64', '[\"*\"]', '2025-12-21 21:10:11', NULL, '2025-12-21 21:09:55', '2025-12-21 21:10:11'),
(10, 'App\\Models\\User', 3, 'crm-token', '38386da1768bb407736570763aeff54ef408c2653e9887b36d5009b55022109a', '[\"*\"]', '2025-12-21 21:10:24', NULL, '2025-12-21 21:10:21', '2025-12-21 21:10:24'),
(11, 'App\\Models\\User', 1, 'crm-token', 'eb84f3253b38a32256c6b608e2ef9f33eb43e970a5f28fe5c0395360b0c7543e', '[\"*\"]', '2025-12-21 21:12:50', NULL, '2025-12-21 21:10:37', '2025-12-21 21:12:50'),
(12, 'App\\Models\\User', 4, 'crm-token', 'd72bc5b335cf1537d6ec44932a3f53d766c152b5c4de00d291bd06b931e1aed3', '[\"*\"]', '2025-12-21 21:13:12', NULL, '2025-12-21 21:13:02', '2025-12-21 21:13:12'),
(13, 'App\\Models\\User', 3, 'crm-token', '0e81e69dda69fc742e008f8e22e71975497744ae636f4af6ec869ff3e5b21248', '[\"*\"]', '2025-12-21 21:13:37', NULL, '2025-12-21 21:13:23', '2025-12-21 21:13:37'),
(14, 'App\\Models\\User', 1, 'crm-token', 'edac41585f163045e7700f7d461664f1c51efffdafec2e63841c7282096048c1', '[\"*\"]', '2025-12-21 21:17:09', NULL, '2025-12-21 21:13:45', '2025-12-21 21:17:09'),
(15, 'App\\Models\\User', 1, 'crm-token', '0dbee753161921aad8d01e99925de22c5058609b9fb46fba0d075892171f3f95', '[\"*\"]', '2025-12-21 21:20:25', NULL, '2025-12-21 21:17:17', '2025-12-21 21:20:25'),
(16, 'App\\Models\\User', 1, 'crm-token', '719009aa8fa4e43349185af923c5db03ca7895226b8045b5a791f52874631523', '[\"*\"]', '2025-12-22 21:29:24', NULL, '2025-12-21 21:20:32', '2025-12-22 21:29:24'),
(17, 'App\\Models\\User', 1, 'crm-token', '4353267359b390e30df8fb3ad061ba6ca0045609b14d0a91dbd2538c299c4230', '[\"*\"]', '2025-12-22 21:37:41', NULL, '2025-12-22 21:29:34', '2025-12-22 21:37:41'),
(18, 'App\\Models\\User', 1, 'crm-token', 'cdb59dc9143e146dd4a947d65533584dec720bf42edc004c1c8eb916bb04ba8e', '[\"*\"]', '2025-12-23 20:58:36', NULL, '2025-12-22 21:37:55', '2025-12-23 20:58:36'),
(19, 'App\\Models\\User', 1, 'crm-token', 'b2f827da8e4d779c3d9aa24a0c98f012efe7b0660cdc0684510fe315b2f92a73', '[\"*\"]', '2025-12-23 21:01:48', NULL, '2025-12-23 20:58:47', '2025-12-23 21:01:48'),
(20, 'App\\Models\\User', 1, 'crm-token', '432b99bfe55df2e03c363019331d4985c606a855877688ed535670a29ec382b7', '[\"*\"]', '2025-12-25 01:44:27', NULL, '2025-12-23 21:02:02', '2025-12-25 01:44:27'),
(21, 'App\\Models\\User', 1, 'crm-token', '966aa1af8becce4e4294ca81e2e87aa4474728a99df092467939c102309374dd', '[\"*\"]', '2025-12-25 06:05:46', NULL, '2025-12-25 01:44:36', '2025-12-25 06:05:46'),
(22, 'App\\Models\\User', 1, 'crm-token', '7b3b944908098310274de1c9f0803b5fb9f7461fef662e4681d5d9eaa4189da6', '[\"*\"]', '2025-12-26 21:23:51', NULL, '2025-12-25 06:05:54', '2025-12-26 21:23:51'),
(23, 'App\\Models\\User', 1, 'crm-token', '8ae1f97cff26c85946ec6919f028b4eecabe21cbc981abfd22338e6d510360de', '[\"*\"]', '2025-12-29 20:23:23', NULL, '2025-12-26 21:24:06', '2025-12-29 20:23:23'),
(24, 'App\\Models\\User', 1, 'crm-token', '4ca73998ed0f3ce2ccb3b11857067dadc3c3c6c7246390e37ff28a05942ddc8d', '[\"*\"]', '2025-12-30 20:42:22', NULL, '2025-12-29 20:23:28', '2025-12-30 20:42:22'),
(25, 'App\\Models\\User', 1, 'crm-token', '4e6e21617e39f8630f1353838351bb6813208fbaf39e5ee1c1e4a537b33d1d60', '[\"*\"]', '2025-12-30 21:23:19', NULL, '2025-12-30 20:42:35', '2025-12-30 21:23:19'),
(26, 'App\\Models\\User', 1, 'crm-token', '1920653d3aaf0af33744fe5779730e82bb560eda08a52d0e2fbc7f0f42c05366', '[\"*\"]', '2025-12-31 19:58:48', NULL, '2025-12-30 21:23:30', '2025-12-31 19:58:48'),
(27, 'App\\Models\\User', 1, 'crm-token', 'e392cf2d5845401fe0109e6caad9dfa2bd16aacfa3346968fc0e500872747fb6', '[\"*\"]', '2026-01-01 20:44:14', NULL, '2025-12-31 20:01:37', '2026-01-01 20:44:14'),
(28, 'App\\Models\\User', 1, 'crm-token', 'bfc68f4a88566bd5c9f73c9e641a8dcce215025c8a11a63d36c65dd1764ff7a0', '[\"*\"]', '2026-01-03 23:05:58', NULL, '2026-01-01 20:44:22', '2026-01-03 23:05:58'),
(29, 'App\\Models\\User', 1, 'crm-token', '1d0e5739613c078b736a2640928ba652ca4b91b58e5d5b6b0d8e833b22a4e0b1', '[\"*\"]', NULL, NULL, '2026-01-04 01:12:25', '2026-01-04 01:12:25'),
(30, 'App\\Models\\User', 1, 'crm-token', 'bffafe1cb87111557d2eabb17ba4dfb84d68600a938a9b83210ee1f1e32f5228', '[\"*\"]', '2026-01-04 01:20:35', NULL, '2026-01-04 01:20:30', '2026-01-04 01:20:35'),
(31, 'App\\Models\\User', 1, 'crm-token', '9635ff02a8a8c5da0112cf0538345d0a3cc09e387913abff9d681657b1c3b8b0', '[\"*\"]', '2026-01-04 01:30:12', NULL, '2026-01-04 01:20:40', '2026-01-04 01:30:12'),
(32, 'App\\Models\\User', 6, 'crm-token', 'd3ccd404fd6e02c477984fba827eb947d68fa0f08c20c38dd2d40ad28f052b46', '[\"*\"]', '2026-01-04 01:34:28', NULL, '2026-01-04 01:30:28', '2026-01-04 01:34:28'),
(33, 'App\\Models\\User', 1, 'crm-token', '15ea1bfcbfb98184f2de003f8ec7222a31259c60cc1d65cdfb9d15b213d1373b', '[\"*\"]', '2026-01-04 01:35:48', NULL, '2026-01-04 01:34:41', '2026-01-04 01:35:48'),
(34, 'App\\Models\\User', 6, 'crm-token', 'c842dae8531376f206728882f4e0193489dffd9a2f2309feea58bcbf57192185', '[\"*\"]', '2026-01-04 01:36:15', NULL, '2026-01-04 01:36:08', '2026-01-04 01:36:15'),
(35, 'App\\Models\\User', 1, 'crm-token', 'b20710378b54980e86d4e28231d7883738c4d5997eb03153de6cac80db48cc15', '[\"*\"]', '2026-01-04 01:48:12', NULL, '2026-01-04 01:36:45', '2026-01-04 01:48:12'),
(36, 'App\\Models\\User', 1, 'crm-token', '1b05019ae7f24bdfd63ec8e7b22e49d2ff5addf21c8ae9720cde1ccd77ee813b', '[\"*\"]', '2026-01-04 03:49:12', NULL, '2026-01-04 01:48:20', '2026-01-04 03:49:12'),
(37, 'App\\Models\\User', 1, 'crm-token', 'db30dc143eec6e6a105d5018f1d744cadab63751e17d32f924ab7b8cf425e49d', '[\"*\"]', '2026-01-04 08:31:47', NULL, '2026-01-04 03:49:19', '2026-01-04 08:31:47'),
(38, 'App\\Models\\User', 1, 'crm-token', '333494ef57811ca80b28306a7211ab79acbef3b82894365ea85d99402e2c6361', '[\"*\"]', '2026-01-04 08:35:44', NULL, '2026-01-04 08:33:50', '2026-01-04 08:35:44');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `description`, `price`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Beef', 'dfasdf', 555.00, 'active', 1, '2025-12-21 08:54:09', '2025-12-21 08:54:09');

-- --------------------------------------------------------

--
-- Table structure for table `service_people`
--

CREATE TABLE `service_people` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `present_address` varchar(255) NOT NULL,
  `permanent_address` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `emergency_contact_name` varchar(255) NOT NULL,
  `emergency_contact_phone` varchar(255) NOT NULL,
  `emergency_contact_relation` varchar(255) NOT NULL,
  `salary` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_people`
--

INSERT INTO `service_people` (`id`, `first_name`, `last_name`, `phone`, `email`, `present_address`, `permanent_address`, `photo`, `emergency_contact_name`, `emergency_contact_phone`, `emergency_contact_relation`, `salary`, `created_at`, `updated_at`) VALUES
(1, 'Shifat E', 'Rasul', '01871769835', 'shifaterasulbd@gmail.com', '51,Arjotpara,Mohakhali Dhaka', 'asdfasdfasd', 'asdfasdf', 'Shifat E Rasul', '01871769835', 'asdfasdf', 20000.00, '2025-12-25 01:44:54', '2025-12-25 01:44:54'),
(2, 'Merchant', 'Test', '01811111111', 'merchant1@gmail.com', 'Mirpur DOHS', 'asdfasdfasd', 'asdfasdf', 'Merchant Test', '01811111111', 'asdfasdf', 20000.00, '2025-12-30 21:11:58', '2025-12-30 21:11:58'),
(3, 'Customer', 'Restro', '01811111111', 'customer@restro.com', '51,Arjotpara,Mohakhali Dhaka', 'asdfasdfasd', 'asdfasdf', 'Customer Restro', '01811111111', 'asdfasdf', 30900.00, '2026-01-03 21:50:01', '2026-01-03 21:53:05');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('CS7caUJe7XS6UVwlmdHLwSnAwi9kEMWzzYOzns65', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYTZ4VTY4a2NHQktxRnFxRnFQUDVReDN4aTRvQ1B1UVllVkJhMm1iUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9yZXBvcnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1767537072);

-- --------------------------------------------------------

--
-- Table structure for table `task_followups`
--

CREATE TABLE `task_followups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Test User', 'test@example.com', NULL, '$2y$12$k.0f9Xn2msHsOlD4SS.x1OiH/9QFQ6HIPXkuuFxvOJgwCqa7JnWWe', NULL, '2025-12-21 08:52:00', '2025-12-21 08:52:00'),
(3, 'Shifat E Rasul', 'shifaterasulbd@gmail.com', NULL, '$2y$12$ldRV9nYzxRnbpviabWyc5urXHiOY4Q8Ta4KkUgllOH69VMcHLr.NK', NULL, '2025-12-21 09:49:20', '2025-12-21 09:49:20'),
(4, 'Chui Kacchi', 'customer@restro.com', NULL, '$2y$12$z0bKCPqwFGkdObggxN26RuwBcv9srLRGEop7pOiIRKHp4.SAd2axC', NULL, '2025-12-21 09:53:08', '2025-12-21 09:53:08'),
(6, 'Shifat E Rasul', 'shifaterasulweewebd@gmail.com', NULL, '$2y$12$7jtaLSAi.TzXhQUgVqV8PunlBfc28UjmMLHoO0atgUlTnwhyKVMHi', NULL, '2025-12-25 06:07:40', '2025-12-25 06:07:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activities_user_id_foreign` (`user_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employees_email_unique` (`email`);

--
-- Indexes for table `employee_login_histories`
--
ALTER TABLE `employee_login_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_login_histories_employee_id_foreign` (`employee_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `interactions`
--
ALTER TABLE `interactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `interactions_lead_id_foreign` (`lead_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leads_assigned_to_foreign` (`assigned_to`),
  ADD KEY `leads_created_by_foreign` (`created_by`),
  ADD KEY `leads_email_index` (`email`),
  ADD KEY `leads_phone_index` (`phone`),
  ADD KEY `leads_service_id_foreign` (`service_id`),
  ADD KEY `leads_reference_by_customer_foreign` (`reference_by_customer`);

--
-- Indexes for table `lead_service_people`
--
ALTER TABLE `lead_service_people`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lead_service_people_lead_id_service_person_id_unique` (`lead_id`,`service_person_id`),
  ADD KEY `lead_service_people_service_person_id_foreign` (`service_person_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `services_created_by_foreign` (`created_by`),
  ADD KEY `services_status_index` (`status`);

--
-- Indexes for table `service_people`
--
ALTER TABLE `service_people`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `service_people_email_unique` (`email`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `task_followups`
--
ALTER TABLE `task_followups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_followups_user_id_foreign` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `employee_login_histories`
--
ALTER TABLE `employee_login_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `interactions`
--
ALTER TABLE `interactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leads`
--
ALTER TABLE `leads`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `lead_service_people`
--
ALTER TABLE `lead_service_people`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `service_people`
--
ALTER TABLE `service_people`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `task_followups`
--
ALTER TABLE `task_followups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `activities_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_login_histories`
--
ALTER TABLE `employee_login_histories`
  ADD CONSTRAINT `employee_login_histories_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `interactions`
--
ALTER TABLE `interactions`
  ADD CONSTRAINT `interactions_lead_id_foreign` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `leads`
--
ALTER TABLE `leads`
  ADD CONSTRAINT `leads_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `leads_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leads_reference_by_customer_foreign` FOREIGN KEY (`reference_by_customer`) REFERENCES `leads` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `leads_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `lead_service_people`
--
ALTER TABLE `lead_service_people`
  ADD CONSTRAINT `lead_service_people_lead_id_foreign` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lead_service_people_service_person_id_foreign` FOREIGN KEY (`service_person_id`) REFERENCES `service_people` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `task_followups`
--
ALTER TABLE `task_followups`
  ADD CONSTRAINT `task_followups_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
