-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 29, 2019 at 01:02 AM
-- Server version: 5.7.27-0ubuntu0.18.04.1
-- PHP Version: 7.2.19-0ubuntu0.18.04.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `downvote_control_tool`
--

-- --------------------------------------------------------

--
-- Table structure for table `executed_votes`
--

CREATE TABLE `executed_votes` (
  `id` int(11) NOT NULL,
  `username` varchar(16) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `author` varchar(16) NOT NULL,
  `permlink` varchar(256) NOT NULL,
  `percentage` smallint(6) NOT NULL,
  `date` int(11) DEFAULT NULL,
  `reason` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `hitlist`
--

CREATE TABLE `hitlist` (
  `username` varchar(16) NOT NULL,
  `author` varchar(16) NOT NULL,
  `percent` float NOT NULL,
  `min_payout` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `trail`
--

CREATE TABLE `trail` (
  `id` int(11) NOT NULL,
  `username` varchar(16) NOT NULL,
  `trailed` varchar(16) NOT NULL,
  `ratio` float NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '-1 negative trail, 1 positive trail, 2 counter downvotes'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user_data`
--

CREATE TABLE `user_data` (
  `username` varchar(16) NOT NULL,
  `dv_threshold` float NOT NULL,
  `vp_threshold` float NOT NULL DEFAULT '95',
  `min_payout` int(11) NOT NULL,
  `revote` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user_login`
--

CREATE TABLE `user_login` (
  `username` varchar(16) NOT NULL,
  `encrypted_username` varchar(248) NOT NULL,
  `iv` varchar(80) NOT NULL,
  `token` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `whitelist`
--

CREATE TABLE `whitelist` (
  `id` int(11) NOT NULL,
  `username` varchar(16) NOT NULL,
  `trailed` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `executed_votes`
--
ALTER TABLE `executed_votes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hitlist`
--
ALTER TABLE `hitlist`
  ADD PRIMARY KEY (`username`,`author`);

--
-- Indexes for table `trail`
--
ALTER TABLE `trail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_data`
--
ALTER TABLE `user_data`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `user_login`
--
ALTER TABLE `user_login`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `whitelist`
--
ALTER TABLE `whitelist`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `executed_votes`
--
ALTER TABLE `executed_votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5550;

--
-- AUTO_INCREMENT for table `trail`
--
ALTER TABLE `trail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=350;

--
-- AUTO_INCREMENT for table `whitelist`
--
ALTER TABLE `whitelist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;