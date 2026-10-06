# ==============================================================================
# ChessTogether - 1-Click AWS EC2 t3.micro Creation & Auto-Deploy Script
# ==============================================================================
$Region = "ap-south-1"
$InstanceType = "t3.micro"
$KeyName = "chess-key"
$SgName = "chess-backend-sg"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Creating AWS EC2 ($InstanceType) in $Region" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Key Pair
Write-Host "[1/4] Checking / Creating Key Pair ($KeyName)..." -ForegroundColor Yellow
$allKeys = aws ec2 describe-key-pairs --region $Region --query "KeyPairs[*].KeyName" --output text
if ($allKeys -notmatch "\b$KeyName\b") {
    Write-Host "Creating Key Pair '$KeyName' and saving '$KeyName.pem' locally..."
    aws ec2 create-key-pair --region $Region --key-name $KeyName --query "KeyMaterial" --output text | Out-File -Encoding ascii "$KeyName.pem"
    Write-Host "Saved $KeyName.pem successfully!" -ForegroundColor Green
} else {
    Write-Host "Key pair '$KeyName' already exists." -ForegroundColor Gray
}

# 2. Security Group
Write-Host "[2/4] Checking / Creating Security Group ($SgName)..." -ForegroundColor Yellow
$allSgs = aws ec2 describe-security-groups --region $Region --query "SecurityGroups[*].GroupName" --output text
if ($allSgs -notmatch "\b$SgName\b") {
    $sgId = aws ec2 create-security-group --region $Region --group-name $SgName --description "ChessTogether Backend Security Group" --output text --query "GroupId"
    Write-Host "Created Security Group $sgId. Authorizing ports (22, 80, 443, 8080, 9092)..." -ForegroundColor Green
    aws ec2 authorize-security-group-ingress --region $Region --group-id $sgId --protocol tcp --port 22 --cidr 0.0.0.0/0 | Out-Null
    aws ec2 authorize-security-group-ingress --region $Region --group-id $sgId --protocol tcp --port 80 --cidr 0.0.0.0/0 | Out-Null
    aws ec2 authorize-security-group-ingress --region $Region --group-id $sgId --protocol tcp --port 443 --cidr 0.0.0.0/0 | Out-Null
    aws ec2 authorize-security-group-ingress --region $Region --group-id $sgId --protocol tcp --port 8080 --cidr 0.0.0.0/0 | Out-Null
    aws ec2 authorize-security-group-ingress --region $Region --group-id $sgId --protocol tcp --port 9092 --cidr 0.0.0.0/0 | Out-Null
} else {
    $sgId = aws ec2 describe-security-groups --region $Region --group-names $SgName --query "SecurityGroups[0].GroupId" --output text
    Write-Host "Security Group '$SgName' ($sgId) already exists." -ForegroundColor Gray
}

# 3. Latest Ubuntu 24.04 LTS AMI
Write-Host "[3/4] Finding latest Ubuntu 24.04 LTS AMI..." -ForegroundColor Yellow
$amiId = aws ec2 describe-images --region $Region --owners 099720109477 --filters "Name=name,Values=ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*" "Name=state,Values=available" --query "sort_by(Images, &CreationDate)[-1].ImageId" --output text
Write-Host "Found AMI: $amiId" -ForegroundColor Green

# 4. Launch Instance with UserData
Write-Host "[4/4] Launching EC2 t3.micro Instance with automated bootstrap..." -ForegroundColor Yellow
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$userDataFile = (Join-Path $scriptDir "user-data.sh") -replace '\\', '/'
$userDataUri = "file://$userDataFile"

$instanceJson = aws ec2 run-instances `
    --region $Region `
    --image-id $amiId `
    --instance-type $InstanceType `
    --key-name $KeyName `
    --security-group-ids $sgId `
    --user-data "$userDataUri" `
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=ChessTogether-Backend}]" `
    | ConvertFrom-Json

$instanceId = $instanceJson.Instances[0].InstanceId
Write-Host "Instance created with ID: $instanceId" -ForegroundColor Green
Write-Host "Waiting for instance to be in 'running' state..." -ForegroundColor Yellow

aws ec2 wait instance-running --region $Region --instance-ids $instanceId
$publicIp = aws ec2 describe-instances --region $Region --instance-ids $instanceId --query "Reservations[0].Instances[0].PublicIpAddress" --output text

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  SUCCESS! AWS EC2 INSTANCE LAUNCHED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Instance ID:    $instanceId"
Write-Host "  Region:         $Region"
Write-Host "  Public IPv4:    $publicIp" -ForegroundColor Cyan
Write-Host "  SSH Command:    ssh -i .\$KeyName.pem ubuntu@$publicIp"
Write-Host ""
Write-Host "  Vercel Environment Variables to set:" -ForegroundColor Yellow
Write-Host "     BACKEND_URL            = http://$publicIp"
Write-Host "     NEXT_PUBLIC_SOCKET_URL = http://$publicIp"
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Note: It takes about 2-3 minutes for Docker and containers to bootstrap on first boot." -ForegroundColor Gray
